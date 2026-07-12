const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: '📁',
  },
  color: {
    type: DataTypes.STRING(7),
    defaultValue: '#6366f1',
  },
  budgetLimit: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'budget_limit',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
});

const Policy = sequelize.define('Policy', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  maxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'max_amount',
  },
  requiresReceipt: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'requires_receipt',
  },
  autoApproveLimit: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'auto_approve_limit',
  },
  categoryName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'category_name',
  },
});

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('info', 'success', 'warning', 'error', 'approval'),
    defaultValue: 'info',
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_read',
  },
  metadata: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const raw = this.getDataValue('metadata');
      return raw ? JSON.parse(raw) : null;
    },
    set(val) {
      this.setDataValue('metadata', val ? JSON.stringify(val) : null);
    },
  },
});

const Approval = sequelize.define('Approval', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  expenseId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'expense_id',
  },
  approverId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'approver_id',
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  actionDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'action_date',
  },
});

module.exports = { Category, Policy, Notification, Approval };
