const crypto = require('crypto');
const { Expense } = require('../models');
const { Op } = require('sequelize');

/**
 * Service to generate cryptographic hashes for approved expenses
 * to simulate an immutable blockchain ledger.
 */
class BlockchainService {
  /**
   * Generates a SHA-256 hash for an expense record
   */
  static generateHash(expenseData, previousHash) {
    const dataString = JSON.stringify({
      id: expenseData.id,
      amount: expenseData.amount,
      category: expenseData.category,
      date: expenseData.date,
      status: expenseData.status,
      approvedBy: expenseData.approvedBy,
      previousHash: previousHash || '0',
    });
    
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * Seals an approved expense by linking it to the previous approved expense's hash
   */
  static async sealExpense(expense) {
    if (expense.status !== 'approved' && expense.status !== 'reimbursed') {
      throw new Error('Can only seal approved or reimbursed expenses.');
    }

    // Find the most recently approved expense that has a hash
    const previousExpense = await Expense.findOne({
      where: {
        hash: { [Op.not]: null },
      },
      order: [['approvedAt', 'DESC']],
    });

    const previousHash = previousExpense ? previousExpense.hash : '0';
    
    // Generate new hash
    const newHash = this.generateHash(expense, previousHash);
    
    // We don't save here to allow the caller to save it in a transaction
    return {
      hash: newHash,
      previousHash: previousHash
    };
  }

  /**
   * Verifies the integrity of the blockchain
   */
  static async verifyLedger() {
    const expenses = await Expense.findAll({
      where: { hash: { [Op.not]: null } },
      order: [['approvedAt', 'ASC']],
    });

    const issues = [];
    let currentPreviousHash = '0';

    for (const exp of expenses) {
      if (exp.previousHash !== currentPreviousHash) {
        issues.push({ expenseId: exp.id, error: 'Chain broken' });
      }

      const expectedHash = this.generateHash(exp, exp.previousHash);
      if (expectedHash !== exp.hash) {
        issues.push({ expenseId: exp.id, error: 'Data tampered' });
      }

      currentPreviousHash = exp.hash;
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

module.exports = BlockchainService;
