const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticate, generateToken } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, department } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'employee',
      department: department || 'General',
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: user.toSafeJSON(),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful.',
      token,
      user: user.toSafeJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ user: user.toSafeJSON() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

module.exports = router;
