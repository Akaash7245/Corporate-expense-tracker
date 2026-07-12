const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/users — list users (admin, finance, manager)
router.get('/', authenticate, requireRole('admin', 'finance', 'manager'), async (req, res) => {
  try {
    const { role, department, isActive, search } = req.query;
    const where = {};
    if (role) where.role = role;
    if (department) where.department = department;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    res.json({ users, total: users.length });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// GET /api/users/team — get manager's team
router.get('/team', authenticate, async (req, res) => {
  try {
    const team = await User.findAll({
      where: { managerId: req.user.id },
      attributes: { exclude: ['password'] },
    });
    res.json({ team });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team.' });
  }
});

// POST /api/users — create user (admin only)
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, department, managerId } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Email, password, first name and last name are required.' });
    }

    // Check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'employee',
      department: department || 'General',
      managerId: managerId || null,
    });

    res.status(201).json({ user: user.toSafeJSON(), message: 'User created successfully.' });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// PUT /api/users/:id — update user
router.put('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const { firstName, lastName, department, avatar, role, managerId, isActive } = req.body;
    
    const updates = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (department !== undefined) updates.department = department;
    if (avatar !== undefined) updates.avatar = avatar;

    // Only admin can change role, managerId, isActive
    if (req.user.role === 'admin') {
      if (role !== undefined) updates.role = role;
      if (managerId !== undefined) updates.managerId = managerId;
      if (isActive !== undefined) updates.isActive = isActive;
    }

    await user.update(updates);
    res.json({ user: user.toSafeJSON() });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

// PATCH /api/users/:id/toggle-active — toggle user active status (admin only)
router.patch('/:id/toggle-active', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Prevent admin from deactivating themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'You cannot deactivate your own account.' });
    }

    await user.update({ isActive: !user.isActive });
    res.json({
      user: user.toSafeJSON(),
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status.' });
  }
});

// DELETE /api/users/:id — delete user (admin only, soft delete via deactivation)
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }

    await user.update({ isActive: false });
    res.json({ message: 'User deactivated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

module.exports = router;
