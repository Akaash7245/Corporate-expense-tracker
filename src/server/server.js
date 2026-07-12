require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const sequelize = require('./config/database');
const setupSocket = require('./socket');

// Import models (this triggers associations)
const { User, Expense, Category, Policy, Notification, Approval } = require('./models');

// Import routes
const authRoutes = require('./routes/auth.routes');
const expenseRoutes = require('./routes/expense.routes');
const userRoutes = require('./routes/user.routes');
const miscRoutes = require('./routes/misc.routes');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

setupSocket(io);
app.set('io', io);

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);
app.use('/api', miscRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle specific sequelize errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: err.errors[0].message,
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle unhandled rejections and uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optional: Gracefully shutdown or alert monitoring
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Mandatory: Gracefully shutdown the server after a short delay
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Sync database
    await sequelize.sync();
    console.log('✅ Database synced successfully');

    // Seed default categories if empty
    const catCount = await Category.count();
    if (catCount === 0) {
      await Category.bulkCreate([
        { name: 'Travel', icon: '✈️', color: '#6366f1', budgetLimit: 150000 },
        { name: 'Food & Dining', icon: '🍽️', color: '#f59e0b', budgetLimit: 50000 },
        { name: 'Office Supplies', icon: '📎', color: '#10b981', budgetLimit: 40000 },
        { name: 'Accommodation', icon: '🏨', color: '#8b5cf6', budgetLimit: 120000 },
        { name: 'Transportation', icon: '🚗', color: '#3b82f6', budgetLimit: 80000 },
        { name: 'Communication', icon: '📱', color: '#ec4899', budgetLimit: 15000 },
        { name: 'Entertainment', icon: '🎭', color: '#14b8a6', budgetLimit: 30000 },
        { name: 'Miscellaneous', icon: '📁', color: '#64748b', budgetLimit: 25000 },
      ]);
      console.log('✅ Default categories seeded');
    }

    server.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Socket.io listening on port ${PORT}`);
      console.log(`📁 Uploads directory: ${path.join(__dirname, '../../uploads')}`);
      console.log(`🔑 JWT Secret configured: ${process.env.JWT_SECRET ? 'Yes' : 'No'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
