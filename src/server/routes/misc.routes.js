const express = require('express');
const router = express.Router();
const { Category, Policy, Notification } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');

// ==================== CATEGORIES ====================

router.get('/categories', authenticate, async (req, res) => {
  try {
    const categories = await Category.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

router.post('/categories', authenticate, requireRole('admin', 'finance'), async (req, res) => {
  try {
    const { name, icon, color, budgetLimit } = req.body;
    const category = await Category.create({ name, icon, color, budgetLimit });
    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category.' });
  }
});

router.put('/categories/:id', authenticate, requireRole('admin', 'finance'), async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    await category.update(req.body);
    res.json({ category });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category.' });
  }
});

// ==================== POLICIES ====================

router.get('/policies', authenticate, async (req, res) => {
  try {
    const policies = await Policy.findAll({ order: [['name', 'ASC']] });
    res.json({ policies });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch policies.' });
  }
});

router.post('/policies', authenticate, requireRole('admin', 'finance'), async (req, res) => {
  try {
    const policy = await Policy.create(req.body);
    res.status(201).json({ policy });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create policy.' });
  }
});

// ==================== NOTIFICATIONS ====================

router.get('/notifications', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    const unreadCount = await Notification.count({
      where: { userId: req.user.id, isRead: false },
    });
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});

router.patch('/notifications/:id/read', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found.' });
    if (notification.userId !== req.user.id) return res.status(403).json({ error: 'Access denied.' });
    await notification.update({ isRead: true });
    res.json({ notification });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification.' });
  }
});

router.patch('/notifications/read-all', authenticate, async (req, res) => {
  try {
    await Notification.update({ isRead: true }, { where: { userId: req.user.id, isRead: false } });
    res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notifications.' });
  }
});

// ==================== FILE UPLOAD ====================

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only images and PDFs are allowed.'));
  },
});

router.post('/upload', authenticate, upload.single('receipt'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed.' });
  }
});

module.exports = router;
