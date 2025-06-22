// server/socket/handlers/chatHandler.js
module.exports = (io, socket) => {
  socket.on('send_message', ({ roomId, message }) => {
    io.to(roomId).emit('receive_message', {
      username: socket.username,
      message,
      timestamp: new Date(),
    });
  });
};
