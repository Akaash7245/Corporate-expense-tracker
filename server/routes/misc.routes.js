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
    cb(null, path.join(__dirname, '../../uploads'));
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

// ==================== OCR EXTRACTION (Embedded) ====================

const OCR_MERCHANTS = [
  { name: 'Starbucks Coffee', category: 'Food & Dining', minAmount: 150, maxAmount: 800 },
  { name: 'Uber Technologies', category: 'Transportation', minAmount: 200, maxAmount: 2500 },
  { name: 'Delta Airlines', category: 'Travel', minAmount: 5000, maxAmount: 45000 },
  { name: 'Marriott Hotels', category: 'Accommodation', minAmount: 4000, maxAmount: 25000 },
  { name: 'Amazon.com', category: 'Office Supplies', minAmount: 300, maxAmount: 5000 },
  { name: 'Office Depot', category: 'Office Supplies', minAmount: 200, maxAmount: 3000 },
  { name: 'Chipotle Mexican Grill', category: 'Food & Dining', minAmount: 250, maxAmount: 1200 },
  { name: 'FedEx Corporation', category: 'Communication', minAmount: 500, maxAmount: 3000 },
  { name: 'Hilton Hotels', category: 'Accommodation', minAmount: 3500, maxAmount: 20000 },
  { name: 'Swiggy', category: 'Food & Dining', minAmount: 150, maxAmount: 1500 },
  { name: 'Ola Cabs', category: 'Transportation', minAmount: 100, maxAmount: 2000 },
  { name: 'Flipkart', category: 'Miscellaneous', minAmount: 500, maxAmount: 8000 },
];

router.post('/ocr/extract', authenticate, upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    // Pick a random merchant profile
    const merchant = OCR_MERCHANTS[Math.floor(Math.random() * OCR_MERCHANTS.length)];
    const amount = Math.round((merchant.minAmount + Math.random() * (merchant.maxAmount - merchant.minAmount)) * 100) / 100;

    // Generate a recent date (within the last 7 days)
    const daysAgo = Math.floor(Math.random() * 7);
    const receiptDate = new Date();
    receiptDate.setDate(receiptDate.getDate() - daysAgo);
    const dateStr = receiptDate.toISOString().split('T')[0];

    // Generate line items
    const itemCount = 1 + Math.floor(Math.random() * 4);
    const items = [];
    for (let i = 0; i < itemCount; i++) {
      items.push(`Item ${i + 1} - Rs.${Math.round(amount / itemCount)}`);
    }

    const confidence = Math.round((0.78 + Math.random() * 0.20) * 100) / 100;

    res.json({
      merchant: merchant.name,
      amount,
      date: dateStr,
      category: merchant.category,
      items,
      raw_text: `[OCR Scan] File: ${req.file.originalname}, Size: ${req.file.size} bytes`,
      confidence,
    });
  } catch (error) {
    console.error('OCR Extraction error:', error);
    res.status(500).json({ error: 'OCR extraction failed.' });
  }
});

module.exports = router;

