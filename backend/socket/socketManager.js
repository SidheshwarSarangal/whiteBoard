// server/socket/socketManager.js
const drawingHandler = require('./handlers/drawingHandler');
const roomHandler = require('./handlers/roomHandler');
const userHandler = require('./handlers/userHandler');
const chatHandler = require('./handlers/chatHandler');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    drawingHandler(io, socket);
    roomHandler(io, socket);
    userHandler(io, socket);
    chatHandler(io, socket);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      io.to(socket.roomId).emit('user_left', { socketId: socket.id });
    });
  });
};
