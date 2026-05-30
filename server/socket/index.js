const jwt = require('jsonwebtoken');

function setupSocket(io) {
  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.userId} (${socket.userRole})`);

    // Join user-specific room for targeted notifications
    socket.join(`user:${socket.userId}`);

    // Join role-based rooms
    socket.join(`role:${socket.userRole}`);

    // Handle expense submission via socket
    socket.on('expense:submit', (data) => {
      io.emit('expense:created', data);
    });

    // Handle typing indicator for comments
    socket.on('typing:start', (data) => {
      socket.broadcast.emit('typing:indicator', {
        userId: socket.userId,
        ...data,
      });
    });

    socket.on('typing:stop', () => {
      socket.broadcast.emit('typing:stop', { userId: socket.userId });
    });

    // Dashboard real-time data request
    socket.on('dashboard:subscribe', () => {
      socket.join('dashboard:live');
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.userId}`);
    });
  });

  return io;
}

module.exports = setupSocket;
