// server/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/database');

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
    origin: '*', // For development; restrict in production
    methods: ['GET', 'POST']
  }
});

// Socket connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  // You can add other socket listeners here (e.g. drawing events)
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
