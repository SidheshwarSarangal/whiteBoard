// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const setupSocket = require('./socket/socketManager');
require('dotenv').config();

const roomRoutes = require('./routes/rooms');
const userRoutes = require('./routes/users');
const drawingRoutes = require('./routes/drawings');
const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');


// Initialize app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Set up WebSocket server
const io = new Server(server, {
  cors: {
    origin: '*', // For dev only; restrict this in production
    methods: ['GET', 'POST']
  }
});

// Setup custom socket logic
setupSocket(io);

// Optional: Add REST API routes
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/drawings', drawingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
