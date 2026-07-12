const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define('Expense', {
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
    validate: { len: [2, 200] },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'INR',
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Miscellaneous',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected', 'reimbursed'),
    defaultValue: 'pending',
  },
  receiptUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'receipt_url',
  },
  merchant: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'approved_by',
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at',
  },
  rejectedReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rejected_reason',
  },
  fraudScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    field: 'fraud_score',
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      const raw = this.getDataValue('tags');
      return raw ? raw.split(',') : [];
    },
    set(val) {
      this.setDataValue('tags', Array.isArray(val) ? val.join(',') : val);
    },
  },
});

module.exports = Expense;
