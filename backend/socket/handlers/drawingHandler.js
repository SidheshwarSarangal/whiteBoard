// server/socket/handlers/drawingHandler.js
module.exports = (io, socket) => {
  socket.on('drawing', (data) => {
    const { roomId, stroke } = data;
    socket.to(roomId).emit('drawing', stroke); // send to all others in room
  });
};
