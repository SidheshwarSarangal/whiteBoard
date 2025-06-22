// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const socketSetup = require('./config/socket');
require('dotenv').config();

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
socketSetup(io);

// Optional: Add REST API routes
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/users', require('./routes/users'));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
