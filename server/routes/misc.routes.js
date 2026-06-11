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

// ==================== OCR EXTRACTION (OCR.space API) ====================
const fs = require('fs');

router.post('/ocr/extract', authenticate, upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    // Read the uploaded file into a Buffer
    const fileBuffer = fs.readFileSync(req.file.path);
    const blob = new Blob([fileBuffer], { type: req.file.mimetype || 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('file', blob, req.file.originalname || 'receipt.jpg');
    formData.append('isOverlayRequired', 'false');
    formData.append('isTable', 'true');
    formData.append('scale', 'true');
    formData.append('detectOrientation', 'true');

    // Run OCR using OCR.space Free API
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': 'helloworld' // Free tier API key
      },
      body: formData
    });

    const data = await response.json();
    
    if (data.IsErroredOnProcessing || !data.ParsedResults || data.ParsedResults.length === 0) {
      throw new Error(data.ErrorMessage || 'OCR failed to process image.');
    }

    const text = data.ParsedResults[0].ParsedText;
    console.log('Extracted OCR Text:', text);

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // 1. Guess Merchant (Usually the first or second line)
    let merchant = 'Unknown Merchant';
    if (lines.length > 0) {
      // Avoid lines that just say "Receipt" or "Bill" or numbers
      const firstLines = lines.slice(0, 5).filter(l => !/^(receipt|bill|invoice|tax|cash|\d+)$/i.test(l));
      if (firstLines.length > 0) merchant = firstLines[0];
    }

    // 2. Guess Date (Look for DD/MM/YY, DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
    let dateStr = new Date().toISOString().split('T')[0];
    const dateRegexes = [
      /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/, // DD/MM/YY or MM/DD/YY
      /(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/  // YYYY-MM-DD
    ];

    for (let line of lines) {
      for (let regex of dateRegexes) {
        const match = line.match(regex);
        if (match) {
          try {
            // Very naive date parsing, assumes DD/MM/YY or DD/MM/YYYY
            let d = parseInt(match[1], 10);
            let m = parseInt(match[2], 10) - 1; // 0-indexed
            let y = parseInt(match[3], 10);
            if (y < 100) y += 2000;
            const parsedDate = new Date(y, m, d);
            if (!isNaN(parsedDate.getTime())) {
              dateStr = parsedDate.toISOString().split('T')[0];
              break;
            }
          } catch (e) {
            // Ignore date parsing errors
          }
        }
      }
    }

    // 3. Guess Amount (Find the largest decimal number, usually the total)
    let amount = 0.0;
    const amountRegex = /[\$£€Rs\s]*(\d+[\.,]\d{2})/i;
    let maxAmount = 0.0;
    
    // First, look for explicitly labeled "Total"
    for (let line of lines) {
      if (line.toLowerCase().includes('total') || line.toLowerCase().includes('amount') || line.toLowerCase().includes('net')) {
        const match = line.match(amountRegex) || line.match(/(\d+[\.,]\d{2})/);
        if (match) {
          const val = parseFloat(match[1].replace(',', '.'));
          if (val > amount) amount = val;
        }
      }
      
      // Also track the absolute largest number on the receipt just in case
      const anyMatch = line.match(/(\d+[\.,]\d{2})/);
      if (anyMatch) {
         const val = parseFloat(anyMatch[1].replace(',', '.'));
         if (val > maxAmount) maxAmount = val;
      }
    }
    
    // If no explicit total found, use the largest decimal number
    if (amount === 0.0) amount = maxAmount;

    // 4. Guess Category based on keywords in text
    let category = 'Miscellaneous';
    const textLower = text.toLowerCase();
    if (/(restaurant|cafe|coffee|food|dining|eats|burger|pizza|kitchen|grill|diner)/.test(textLower)) category = 'Food & Dining';
    else if (/(taxi|uber|lyft|transit|train|airline|flight|cab|parking|toll)/.test(textLower)) category = 'Transportation';
    else if (/(hotel|motel|inn|resort|accommodation|lodging)/.test(textLower)) category = 'Accommodation';
    else if (/(office|supplies|paper|staples|depot|stationery)/.test(textLower)) category = 'Office Supplies';
    else if (/(phone|mobile|internet|telecom|wireless|broadband)/.test(textLower)) category = 'Communication';

    // 5. Build simple item list
    const items = lines.slice(0, Math.min(lines.length, 5)).map((l, i) => `Scanned Item ${i+1}: ${l.substring(0, 30)}`);

    res.json({
      merchant,
      amount,
      date: dateStr,
      category,
      items,
      raw_text: text,
      confidence: 0.95, // External API confidence
    });
  } catch (error) {
    console.error('OCR Extraction error:', error);
    res.status(500).json({ error: 'OCR extraction failed.' });
  }
});

module.exports = router;

