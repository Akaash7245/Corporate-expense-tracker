const path = require('path');
module.paths.push(path.join(__dirname, '../src/server/node_modules'));
require('dotenv').config({ path: path.join(__dirname, '../src/server/.env') });
const sequelize = require('../src/server/config/database');
const { User, Expense, Category, Notification, Approval } = require('../src/server/models');
const bcrypt = require('bcryptjs');

const categories = [
  { name: 'Travel', icon: '✈️', color: '#6366f1', budgetLimit: 150000 },
  { name: 'Food & Dining', icon: '🍽️', color: '#f59e0b', budgetLimit: 50000 },
  { name: 'Office Supplies', icon: '📎', color: '#10b981', budgetLimit: 40000 },
  { name: 'Accommodation', icon: '🏨', color: '#8b5cf6', budgetLimit: 120000 },
  { name: 'Transportation', icon: '🚗', color: '#3b82f6', budgetLimit: 80000 },
  { name: 'Communication', icon: '📱', color: '#ec4899', budgetLimit: 15000 },
  { name: 'Entertainment', icon: '🎭', color: '#14b8a6', budgetLimit: 30000 },
  { name: 'Miscellaneous', icon: '📁', color: '#64748b', budgetLimit: 25000 },
];

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Database reset');

    await Category.bulkCreate(categories);
    console.log('✅ Categories seeded');

    // ─── Create Users ────────────────────────────────────────────
    // Admin
    const admin = await User.create({
      email: 'admin@company.com', password: 'Admin123!',
      firstName: 'Akaash', lastName: '',
      role: 'admin', department: 'IT Administration',
    });

    // Finance Team
    const finance = await User.create({
      email: 'finance@company.com', password: 'Finance123!',
      firstName: 'Bhuvana', lastName: '',
      role: 'finance', department: 'Finance & Accounts',
    });
    const finance2 = await User.create({
      email: 'deepa.nair@company.com', password: 'Finance123!',
      firstName: 'Deepa', lastName: 'Nair',
      role: 'finance', department: 'Finance & Accounts',
    });

    // Managers
    const mgrEng = await User.create({
      email: 'manager@company.com', password: 'Manager123!',
      firstName: 'Varshitha', lastName: '',
      role: 'manager', department: 'Engineering',
    });
    const mgrMkt = await User.create({
      email: 'ananya.d@company.com', password: 'Manager123!',
      firstName: 'Ananya', lastName: 'Deshmukh',
      role: 'manager', department: 'Marketing',
    });
    const mgrSales = await User.create({
      email: 'suresh.k@company.com', password: 'Manager123!',
      firstName: 'Suresh', lastName: 'Krishnamurthy',
      role: 'manager', department: 'Sales',
    });
    const mgrProduct = await User.create({
      email: 'meera.r@company.com', password: 'Manager123!',
      firstName: 'Meera', lastName: 'Raghavan',
      role: 'manager', department: 'Product Management',
    });

    // Engineering Team
    const emp1 = await User.create({
      email: 'john@company.com', password: 'Employee123!',
      firstName: 'Srija', lastName: '',
      role: 'employee', department: 'Engineering', managerId: mgrEng.id,
    });
    const emp2 = await User.create({
      email: 'jane@company.com', password: 'Employee123!',
      firstName: 'Neha', lastName: 'Gupta',
      role: 'employee', department: 'Engineering', managerId: mgrEng.id,
    });
    const emp3 = await User.create({
      email: 'rohit.m@company.com', password: 'Employee123!',
      firstName: 'Rohit', lastName: 'Malhotra',
      role: 'employee', department: 'Engineering', managerId: mgrEng.id,
    });
    const emp4 = await User.create({
      email: 'divya.s@company.com', password: 'Employee123!',
      firstName: 'Divya', lastName: 'Srinivasan',
      role: 'employee', department: 'Engineering', managerId: mgrEng.id,
    });

    // Marketing Team
    const emp5 = await User.create({
      email: 'alex@company.com', password: 'Employee123!',
      firstName: 'Karthik', lastName: 'Nair',
      role: 'employee', department: 'Marketing', managerId: mgrMkt.id,
    });
    const emp6 = await User.create({
      email: 'lisa@company.com', password: 'Employee123!',
      firstName: 'Sneha', lastName: 'Joshi',
      role: 'employee', department: 'Marketing', managerId: mgrMkt.id,
    });
    const emp7 = await User.create({
      email: 'pooja.b@company.com', password: 'Employee123!',
      firstName: 'Pooja', lastName: 'Bhatt',
      role: 'employee', department: 'Marketing', managerId: mgrMkt.id,
    });

    // Sales Team
    const emp8 = await User.create({
      email: 'amit.t@company.com', password: 'Employee123!',
      firstName: 'Amit', lastName: 'Tiwari',
      role: 'employee', department: 'Sales', managerId: mgrSales.id,
    });
    const emp9 = await User.create({
      email: 'ritu.v@company.com', password: 'Employee123!',
      firstName: 'Ritu', lastName: 'Verma',
      role: 'employee', department: 'Sales', managerId: mgrSales.id,
    });
    const emp10 = await User.create({
      email: 'sanjay.g@company.com', password: 'Employee123!',
      firstName: 'Sanjay', lastName: 'Garg',
      role: 'employee', department: 'Sales', managerId: mgrSales.id,
    });

    // Product & Design Team
    const emp11 = await User.create({
      email: 'kavita.s@company.com', password: 'Employee123!',
      firstName: 'Kavita', lastName: 'Saxena',
      role: 'employee', department: 'Product Management', managerId: mgrProduct.id,
    });
    const emp12 = await User.create({
      email: 'aditya.c@company.com', password: 'Employee123!',
      firstName: 'Aditya', lastName: 'Chopra',
      role: 'employee', department: 'Design', managerId: mgrProduct.id,
    });

    // Inactive user (edge case)
    const inactiveUser = await User.create({
      email: 'rahul.ex@company.com', password: 'Employee123!',
      firstName: 'Rahul', lastName: '',
      role: 'employee', department: 'Engineering', managerId: mgrEng.id,
      isActive: false,
    });

    console.log('✅ 20 users seeded');

    // ─── Generate Expenses ────────────────────────────────────────
    const statuses = ['pending', 'approved', 'rejected', 'reimbursed', 'draft'];

    const merchants = [
      'Ola Cabs', 'Uber India', 'Swiggy', 'Zomato', 'MakeMyTrip',
      'IRCTC', 'IndiGo Airlines', 'Air India', 'Taj Hotels', 'OYO Rooms',
      'Croma Electronics', 'Amazon India', 'Flipkart', 'BigBasket',
      'Reliance Digital', 'Café Coffee Day', 'Haldiram\'s', 'Barbeque Nation',
      'Jio Recharge', 'Airtel', 'Rapido', 'Cleartrip', 'Goibibo',
      'ITC Hotels', 'Lemon Tree Hotels', 'SpiceJet', 'Vistara',
      'Domino\'s India', 'Chai Point', 'Starbucks India', 'Decathlon India',
      'Crossword Bookstore', 'Urban Company', 'BlueDart', 'DTDC Courier',
    ];

    const expenseTemplates = [
      // Travel — varied price ranges
      { title: 'IndiGo flight BLR–DEL for client demo', category: 'Travel', min: 4500, max: 9800 },
      { title: 'Shatabdi Express Mumbai–Pune', category: 'Travel', min: 750, max: 1650 },
      { title: 'Vistara flight HYD–BLR — sprint review', category: 'Travel', min: 5200, max: 11500 },
      { title: 'Rajdhani Express Delhi–Kolkata', category: 'Travel', min: 2200, max: 4200 },
      { title: 'Air India flight DEL–MAA roundtrip', category: 'Travel', min: 7500, max: 16000 },
      { title: 'SpiceJet flight BOM–GOI — offsite', category: 'Travel', min: 3200, max: 7500 },
      { title: 'Bus Bangalore–Mysore — factory visit', category: 'Travel', min: 450, max: 1100 },

      // Food & Dining
      { title: 'Client lunch at ITC Grand Chola', category: 'Food & Dining', min: 2800, max: 6500 },
      { title: 'Team dinner — sprint celebration', category: 'Food & Dining', min: 5000, max: 14000 },
      { title: 'Working lunch — Swiggy order for team', category: 'Food & Dining', min: 800, max: 2200 },
      { title: 'Chai and samosa — vendor meeting', category: 'Food & Dining', min: 150, max: 450 },
      { title: 'Client dinner at Barbeque Nation', category: 'Food & Dining', min: 3500, max: 9000 },
      { title: 'Coffee with prospect — Starbucks', category: 'Food & Dining', min: 500, max: 1200 },
      { title: 'Team breakfast — Haldiram\'s catering', category: 'Food & Dining', min: 1500, max: 4000 },
      { title: 'Farewell party dinner — departing intern', category: 'Food & Dining', min: 3000, max: 7000 },

      // Office Supplies — including high-value items
      { title: 'HP LaserJet cartridges × 3', category: 'Office Supplies', min: 2500, max: 5500 },
      { title: 'Dell USB-C monitor — WFH setup', category: 'Office Supplies', min: 14000, max: 24000 },
      { title: 'Whiteboard markers, sticky notes, pens', category: 'Office Supplies', min: 250, max: 900 },
      { title: 'Laptop stand + keyboard + mouse — Amazon', category: 'Office Supplies', min: 3000, max: 6500 },
      { title: 'Office chairs × 2 — new joiners', category: 'Office Supplies', min: 8000, max: 18000 },
      { title: 'Printer paper and binders — quarterly', category: 'Office Supplies', min: 400, max: 1200 },

      // Accommodation
      { title: 'Taj Vivanta Bangalore — 2 nights', category: 'Accommodation', min: 12000, max: 22000 },
      { title: 'OYO Townhouse Pune — 3 nights', category: 'Accommodation', min: 4500, max: 9000 },
      { title: 'ITC Maurya Delhi — 2 nights onsite', category: 'Accommodation', min: 16000, max: 32000 },
      { title: 'Lemon Tree Hyderabad — client visit', category: 'Accommodation', min: 5000, max: 10000 },
      { title: 'Novotel Mumbai — conference stay', category: 'Accommodation', min: 9000, max: 18000 },
      { title: 'Airbnb Goa — team offsite (3 rooms)', category: 'Accommodation', min: 15000, max: 35000 },

      // Transportation
      { title: 'Ola cab — Hinjewadi to Pune airport', category: 'Transportation', min: 350, max: 800 },
      { title: 'Uber to Kempegowda Airport BLR', category: 'Transportation', min: 500, max: 1200 },
      { title: 'Rapido bike — Koramangala to Whitefield', category: 'Transportation', min: 100, max: 280 },
      { title: 'Airport transfer Mumbai T2 to Andheri', category: 'Transportation', min: 400, max: 900 },
      { title: 'Auto-rickshaw — local site visits × 5', category: 'Transportation', min: 200, max: 500 },
      { title: 'Self-drive car rental — 3 days Jaipur', category: 'Transportation', min: 4500, max: 9000 },
      { title: 'Metro card recharge — monthly', category: 'Transportation', min: 500, max: 1500 },

      // Communication
      { title: 'Jio postpaid plan — work number', category: 'Communication', min: 599, max: 999 },
      { title: 'Airtel broadband — WFH monthly', category: 'Communication', min: 999, max: 1499 },
      { title: 'International ISD charges — US client calls', category: 'Communication', min: 250, max: 750 },
      { title: 'Zoom Pro subscription — monthly', category: 'Communication', min: 1100, max: 1400 },

      // Entertainment
      { title: 'Team outing — bowling + lunch', category: 'Entertainment', min: 3500, max: 9000 },
      { title: 'IPL match tickets × 4 — client entertainment', category: 'Entertainment', min: 8000, max: 20000 },
      { title: 'Team building — escape room activity', category: 'Entertainment', min: 4000, max: 10000 },
      { title: 'Diwali celebration — office party', category: 'Entertainment', min: 6000, max: 15000 },
      { title: 'Movie outing — team bonding', category: 'Entertainment', min: 2000, max: 5000 },

      // Miscellaneous — edge cases
      { title: 'BlueDart courier — documents to client', category: 'Miscellaneous', min: 200, max: 700 },
      { title: 'US B1 visa processing fee', category: 'Miscellaneous', min: 13000, max: 16500 },
      { title: 'Parking charges — Pune IT Park monthly', category: 'Miscellaneous', min: 1500, max: 3000 },
      { title: 'Annual medical checkup — company policy', category: 'Miscellaneous', min: 2000, max: 5000 },
      { title: 'Conference registration — JSConf India', category: 'Miscellaneous', min: 3000, max: 8000 },
      { title: 'Business cards printing — 500 nos.', category: 'Miscellaneous', min: 800, max: 2000 },
      { title: 'Domain renewal + SSL certificate', category: 'Miscellaneous', min: 1200, max: 3500 },
    ];

    const allEmployees = [
      emp1, emp2, emp3, emp4, emp5, emp6, emp7, emp8, emp9, emp10,
      emp11, emp12, mgrEng, mgrMkt, mgrSales, mgrProduct,
    ];

    const allManagers = [mgrEng, mgrMkt, mgrSales, mgrProduct];

    const expenses = [];

    // Generate 120 expenses with realistic distribution
    for (let i = 0; i < 120; i++) {
      const template = expenseTemplates[i % expenseTemplates.length];
      const employee = allEmployees[i % allEmployees.length];

      // Weighted status distribution: more approved/reimbursed, fewer drafts
      const statusWeights = [
        { status: 'pending', weight: 20 },
        { status: 'approved', weight: 30 },
        { status: 'rejected', weight: 15 },
        { status: 'reimbursed', weight: 30 },
        { status: 'draft', weight: 5 },
      ];
      const totalWeight = statusWeights.reduce((s, w) => s + w.weight, 0);
      let roll = Math.random() * totalWeight;
      let status = 'pending';
      for (const sw of statusWeights) {
        roll -= sw.weight;
        if (roll <= 0) { status = sw.status; break; }
      }

      const amount = (Math.random() * (template.max - template.min) + template.min).toFixed(2);

      // Spread dates across last 8 months for richer trend data
      const daysAgo = Math.floor(Math.random() * 240);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      const dateStr = date.toISOString().split('T')[0];

      const expense = {
        userId: employee.id,
        title: template.title,
        description: `${template.title} — business expense for Q${Math.ceil((date.getMonth() + 1) / 3)} FY${date.getFullYear()}-${(date.getFullYear() + 1).toString().slice(2)}`,
        amount: parseFloat(amount),
        currency: 'INR',
        category: template.category,
        date: dateStr,
        status,
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        fraudScore: Math.random() * 0.3,
      };

      if (status === 'approved' || status === 'reimbursed') {
        expense.approvedBy = allManagers[Math.floor(Math.random() * allManagers.length)].id;
        expense.approvedAt = new Date(date.getTime() + 86400000 * (1 + Math.floor(Math.random() * 7)));
      }

      if (status === 'rejected') {
        expense.rejectedReason = [
          'Amount exceeds departmental policy limit of ₹10,000',
          'Receipt/bill not attached — please resubmit with GST invoice',
          'Duplicate entry — already submitted on earlier date',
          'Not covered under company travel expense policy',
          'Exceeds per-diem allowance for Tier-2 city (₹3,000/day)',
          'Prior approval not obtained from reporting manager',
          'Bill older than 30 days — violates expense submission window',
          'Personal expense — not eligible for reimbursement',
        ][Math.floor(Math.random() * 8)];
        expense.approvedBy = allManagers[Math.floor(Math.random() * allManagers.length)].id;
      }

      expenses.push(expense);
    }

    // Edge case expenses
    const edgeCases = [
      // Very high amount (needs special approval)
      {
        userId: mgrSales.id, title: 'Annual AWS cloud infrastructure renewal',
        description: 'Annual renewal of AWS Reserved Instances — requires CTO approval',
        amount: 485000, currency: 'INR', category: 'Miscellaneous',
        date: '2026-05-15', status: 'pending', merchant: 'Amazon Web Services',
        fraudScore: 0.05,
      },
      // Very small amount
      {
        userId: emp3.id, title: 'Tea and biscuits — standup meeting',
        description: 'Small refreshment for daily standup, petty cash',
        amount: 85, currency: 'INR', category: 'Food & Dining',
        date: '2026-05-28', status: 'approved', merchant: 'Local Canteen',
        fraudScore: 0.01, approvedBy: mgrEng.id, approvedAt: new Date('2026-05-28'),
      },
      // Multi-currency (USD for international travel)
      {
        userId: mgrEng.id, title: 'AWS re:Invent conference — Las Vegas',
        description: 'Registration + travel for AWS re:Invent 2025, converted at ₹83.50/USD',
        amount: 245000, currency: 'INR', category: 'Travel',
        date: '2025-11-20', status: 'reimbursed', merchant: 'AWS Events',
        fraudScore: 0.02, approvedBy: admin.id, approvedAt: new Date('2025-12-05'),
      },
      // Flagged as potentially fraudulent
      {
        userId: emp8.id, title: 'Client dinner — round number suspicious',
        description: 'Dinner with Tata Motors procurement team',
        amount: 10000, currency: 'INR', category: 'Entertainment',
        date: '2026-05-20', status: 'pending', merchant: 'Unknown Restaurant',
        fraudScore: 0.82,
      },
      // Expense from inactive user (historical)
      {
        userId: inactiveUser.id, title: 'Last day team lunch',
        description: 'Farewell lunch before leaving the company',
        amount: 3200, currency: 'INR', category: 'Food & Dining',
        date: '2026-01-15', status: 'reimbursed', merchant: 'Chai Point',
        fraudScore: 0.0, approvedBy: mgrEng.id, approvedAt: new Date('2026-01-16'),
      },
      // Draft expense (saved but not submitted)
      {
        userId: emp1.id, title: 'DRAFT: Mumbai trip — need to add receipts',
        description: 'Need to collect all cab and hotel receipts before submitting',
        amount: 0, currency: 'INR', category: 'Travel',
        date: '2026-05-29', status: 'draft', merchant: '',
        fraudScore: 0.0,
      },
      // Weekend expense (potential policy violation)
      {
        userId: emp5.id, title: 'Saturday client call — co-working space',
        description: 'Co-working desk for weekend client call, WeWork BKC',
        amount: 1500, currency: 'INR', category: 'Miscellaneous',
        date: '2026-05-24', status: 'pending', merchant: 'WeWork India',
        fraudScore: 0.15,
      },
      // Old expense (testing submission window)
      {
        userId: emp9.id, title: 'Q3 client visit — late submission',
        description: 'Late submission from October 2025, missed 30-day window',
        amount: 8750, currency: 'INR', category: 'Travel',
        date: '2025-10-12', status: 'rejected', merchant: 'MakeMyTrip',
        fraudScore: 0.0,
        rejectedReason: 'Submitted after 30-day expense window — policy violation',
        approvedBy: mgrSales.id,
      },
    ];

    await Expense.bulkCreate([...expenses, ...edgeCases]);
    console.log(`✅ ${expenses.length + edgeCases.length} expenses seeded (incl. ${edgeCases.length} edge cases)`);

    // ─── Notifications ────────────────────────────────────────────
    await Notification.bulkCreate([
      { userId: emp1.id, title: 'Expense Approved', message: 'Your expense "IndiGo flight BLR–DEL" (₹7,850) has been approved by Varshitha', type: 'success' },
      { userId: emp1.id, title: 'Expense Rejected', message: 'Your expense "Team dinner" was rejected: Receipt/bill not attached', type: 'error' },
      { userId: emp2.id, title: 'Expense Approved', message: 'Your expense "Ola cab to Hinjewadi" (₹520) has been approved', type: 'success' },
      { userId: emp5.id, title: 'Expense Approved', message: 'Your expense "Client lunch at ITC Grand" (₹4,250) has been approved by Ananya Deshmukh', type: 'success' },
      { userId: emp8.id, title: 'Fraud Alert', message: 'Your expense "Client dinner" (₹10,000) has been flagged for review — round number detected', type: 'warning' },
      { userId: mgrEng.id, title: 'New Expense Submitted', message: 'Srija submitted "Flight to Bangalore" for ₹8,500', type: 'approval' },
      { userId: mgrEng.id, title: 'New Expense Submitted', message: 'Neha Gupta submitted "Dell monitor — WFH" for ₹18,999', type: 'approval' },
      { userId: mgrEng.id, title: 'New Expense Submitted', message: 'Rohit Malhotra submitted "Team outing — bowling" for ₹6,200', type: 'approval' },
      { userId: mgrMkt.id, title: 'New Expense Submitted', message: 'Karthik Nair submitted "IPL tickets × 4" for ₹12,000', type: 'approval' },
      { userId: mgrSales.id, title: 'Budget Warning', message: 'Sales team Travel budget at 92% — ₹1,38,000 of ₹1,50,000 used', type: 'warning' },
      { userId: finance.id, title: 'Monthly Report Ready', message: 'Monthly expense report for May 2026 is ready — total ₹8,45,320', type: 'info' },
      { userId: finance.id, title: 'Budget Alert', message: 'Entertainment category exceeded quarterly budget by ₹5,200 (103%)', type: 'warning' },
      { userId: admin.id, title: 'System Notice', message: 'New user Kavita Saxena added to Product Management department', type: 'info' },
      { userId: admin.id, title: 'Security Alert', message: 'User Rahul has been deactivated', type: 'error' },
    ]);
    console.log('✅ 14 notifications seeded');

    console.log('\n========================================');
    console.log('  🎉 Database seeded successfully!');
    console.log('========================================');
    console.log(`\n  Users:     20 (1 admin, 2 finance, 4 managers, 12 employees, 1 inactive)`);
    console.log(`  Expenses:  ${expenses.length + edgeCases.length} (incl. edge cases: high-value, zero-amount, fraud-flagged, late submissions, drafts)`);
    console.log(`  Notifs:    14`);
    console.log('\nDemo Accounts:');
    console.log('  Admin:    admin@company.com      / Admin123!   (Akaash)');
    console.log('  Finance:  finance@company.com    / Finance123! (Bhuvana)');
    console.log('  Manager:  manager@company.com    / Manager123! (Varshitha)');
    console.log('  Employee: john@company.com       / Employee123! (Srija)');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
