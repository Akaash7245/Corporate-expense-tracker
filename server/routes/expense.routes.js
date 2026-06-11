const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Expense, User, Approval, Notification } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/expenses — list expenses (with filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, category, startDate, endDate, minAmount, maxAmount, page = 1, limit = 20, search } = req.query;
    const where = {};

    // Role-based filtering
    if (req.user.role === 'employee') {
      where.userId = req.user.id;
    } else if (req.user.role === 'manager') {
      // Managers see their team's expenses + their own
      const teamMembers = await User.findAll({ where: { managerId: req.user.id }, attributes: ['id'] });
      const teamIds = teamMembers.map(m => m.id);
      teamIds.push(req.user.id);
      where.userId = { [Op.in]: teamIds };
    }
    // finance & admin see all

    if (status) where.status = status;
    if (category) where.category = category;
    if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      where.date = { [Op.gte]: startDate };
    } else if (endDate) {
      where.date = { [Op.lte]: endDate };
    }
    if (minAmount) where.amount = { ...where.amount, [Op.gte]: parseFloat(minAmount) };
    if (maxAmount) where.amount = { ...where.amount, [Op.lte]: parseFloat(maxAmount) };
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { merchant: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { rows: expenses, count: total } = await Expense.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'department', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      expenses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Fetch expenses error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses.' });
  }
});

// GET /api/expenses/stats — dashboard statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'employee') {
      where.userId = req.user.id;
    }

    const [total, pending, approved, rejected, reimbursed] = await Promise.all([
      Expense.count({ where }),
      Expense.count({ where: { ...where, status: 'pending' } }),
      Expense.count({ where: { ...where, status: 'approved' } }),
      Expense.count({ where: { ...where, status: 'rejected' } }),
      Expense.count({ where: { ...where, status: 'reimbursed' } }),
    ]);

    const totalAmount = await Expense.sum('amount', { where }) || 0;
    const pendingAmount = await Expense.sum('amount', { where: { ...where, status: 'pending' } }) || 0;
    const approvedAmount = await Expense.sum('amount', { where: { ...where, status: 'approved' } }) || 0;

    // Category breakdown
    const expenses = await Expense.findAll({ where, attributes: ['category', 'amount', 'status'] });
    const categoryBreakdown = {};
    const monthlyData = {};

    expenses.forEach(exp => {
      const cat = exp.category;
      if (!categoryBreakdown[cat]) categoryBreakdown[cat] = 0;
      categoryBreakdown[cat] += parseFloat(exp.amount);
    });

    // Monthly trend (last 6 months)
    const allExpenses = await Expense.findAll({
      where,
      attributes: ['amount', 'date', 'status'],
      order: [['date', 'ASC']],
    });

    allExpenses.forEach(exp => {
      const month = exp.date ? exp.date.substring(0, 7) : 'Unknown';
      if (!monthlyData[month]) monthlyData[month] = 0;
      monthlyData[month] += parseFloat(exp.amount);
    });

    res.json({
      counts: { total, pending, approved, rejected, reimbursed },
      amounts: { total: totalAmount, pending: pendingAmount, approved: approvedAmount },
      categoryBreakdown,
      monthlyData,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// GET /api/expenses/:id — single expense
router.get('/:id', authenticate, async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'department'] },
        { model: Approval, as: 'approvals', include: [{ model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName'] }] },
      ],
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    // Access control
    if (req.user.role === 'employee' && expense.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json({ expense });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expense.' });
  }
});

// POST /api/expenses — create expense
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, amount, currency, category, date, merchant, receiptUrl, tags, isOcrReport } = req.body;

    if (!isOcrReport && (!title || !amount || !category)) {
      return res.status(400).json({ error: 'Title, amount, and category are required.' });
    }

    const finalTitle = isOcrReport ? `[OCR REVIEW] ${title || 'Failed Extraction'}` : title;
    const finalAmount = isOcrReport ? parseFloat(amount || 0) : parseFloat(amount);
    const finalDescription = isOcrReport 
      ? `[USER REPORTED OCR FAILURE] Please manually review the attached receipt.\n${description || ''}` 
      : description;

    const expense = await Expense.create({
      userId: req.user.id,
      title: finalTitle,
      description: finalDescription,
      amount: finalAmount,
      currency: currency || 'USD',
      category: category || 'Miscellaneous',
      date: date || new Date().toISOString().split('T')[0],
      merchant,
      receiptUrl,
      tags,
      status: 'pending',
    });

    const fullExpense = await Expense.findByPk(expense.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'department', 'avatar'] }],
    });

    // Notify concerned accounts
    const notificationTitle = isOcrReport ? 'OCR Review Required' : 'New Expense Submitted';
    const notificationMessage = isOcrReport
      ? `${req.user.firstName} ${req.user.lastName} reported an OCR failure for expense: ${finalTitle}`
      : `${req.user.firstName} ${req.user.lastName} submitted "${finalTitle}" for $${finalAmount}`;

    if (req.user.managerId) {
      await Notification.create({
        userId: req.user.managerId,
        title: notificationTitle,
        message: notificationMessage,
        type: 'approval',
        metadata: { expenseId: expense.id },
      });
    } else if (isOcrReport) {
      // If no manager and it's an OCR report, notify admins
      const admins = await User.findAll({ where: { role: 'admin' } });
      for (const admin of admins) {
        await Notification.create({
          userId: admin.id,
          title: notificationTitle,
          message: notificationMessage,
          type: 'approval',
          metadata: { expenseId: expense.id },
        });
      }
    }

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('expense:created', fullExpense);
    }

    res.status(201).json({ expense: fullExpense });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Failed to create expense.' });
  }
});

// PUT /api/expenses/:id — update expense
router.put('/:id', authenticate, async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) return res.status(404).json({ error: 'Expense not found.' });
    if (expense.userId !== req.user.id) return res.status(403).json({ error: 'Access denied.' });
    if (expense.status !== 'draft' && expense.status !== 'pending' && expense.status !== 'rejected') {
      return res.status(400).json({ error: 'Cannot edit expense in current status.' });
    }

    const { title, description, amount, currency, category, date, merchant, receiptUrl, tags } = req.body;

    await expense.update({
      title: title || expense.title,
      description: description !== undefined ? description : expense.description,
      amount: amount ? parseFloat(amount) : expense.amount,
      currency: currency || expense.currency,
      category: category || expense.category,
      date: date || expense.date,
      merchant: merchant !== undefined ? merchant : expense.merchant,
      receiptUrl: receiptUrl !== undefined ? receiptUrl : expense.receiptUrl,
      tags: tags !== undefined ? tags : expense.tags,
      status: 'pending', // Re-submit after edit
    });

    const fullExpense = await Expense.findByPk(expense.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'department', 'avatar'] }],
    });

    if (req.app.get('io')) {
      req.app.get('io').emit('expense:updated', fullExpense);
    }

    res.json({ expense: fullExpense });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Failed to update expense.' });
  }
});

// PATCH /api/expenses/:id/status — approve/reject
router.patch('/:id/status', authenticate, requireRole('manager', 'finance', 'admin'), async (req, res) => {
  try {
    const { status, comments } = req.body;

    if (!['approved', 'rejected', 'reimbursed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const expense = await Expense.findByPk(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found.' });

    await expense.update({
      status,
      approvedBy: req.user.id,
      approvedAt: new Date(),
      rejectedReason: status === 'rejected' ? comments : null,
    });

    // Create approval record
    await Approval.create({
      expenseId: expense.id,
      approverId: req.user.id,
      status,
      comments,
      actionDate: new Date(),
    });

    // Notify employee
    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
    await Notification.create({
      userId: expense.userId,
      title: `Expense ${statusLabel}`,
      message: `Your expense "${expense.title}" has been ${status}${comments ? ': ' + comments : ''}`,
      type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info',
      metadata: { expenseId: expense.id },
    });

    const fullExpense = await Expense.findByPk(expense.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'department', 'avatar'] },
        { model: Approval, as: 'approvals', include: [{ model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName'] }] },
      ],
    });

    if (req.app.get('io')) {
      req.app.get('io').emit('expense:updated', fullExpense);
      req.app.get('io').to(`user:${expense.userId}`).emit('notification', {
        title: `Expense ${statusLabel}`,
        message: `Your expense "${expense.title}" has been ${status}`,
        type: status === 'approved' ? 'success' : 'error',
      });
    }

    res.json({ expense: fullExpense });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found.' });

    if (req.user.role !== 'admin' && expense.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (expense.status === 'approved' || expense.status === 'reimbursed') {
      return res.status(400).json({ error: 'Cannot delete processed expense.' });
    }

    await expense.destroy();
    res.json({ message: 'Expense deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense.' });
  }
});

module.exports = router;
