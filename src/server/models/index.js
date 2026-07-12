const User = require('./User');
const Expense = require('./Expense');
const { Category, Policy, Notification, Approval } = require('./Supporting');

// Associations
User.hasMany(Expense, { foreignKey: 'user_id', as: 'expenses' });
Expense.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Expense.hasMany(Approval, { foreignKey: 'expense_id', as: 'approvals' });
Approval.belongsTo(Expense, { foreignKey: 'expense_id', as: 'expense' });

User.hasMany(Approval, { foreignKey: 'approver_id', as: 'givenApprovals' });
Approval.belongsTo(User, { foreignKey: 'approver_id', as: 'approver' });

// Self-referential: manager relationship
User.hasMany(User, { foreignKey: 'manager_id', as: 'teamMembers' });
User.belongsTo(User, { foreignKey: 'manager_id', as: 'manager' });

module.exports = {
  User,
  Expense,
  Category,
  Policy,
  Notification,
  Approval,
};
