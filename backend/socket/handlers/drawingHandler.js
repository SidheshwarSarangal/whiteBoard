/*module.exports = {
  handleDrawingStart(socket, data, manager) {
    manager.broadcastToRoom(data.roomId, 'drawing:start', data, socket.id);
  },
  handleDrawing(socket, data, manager) {
    manager.broadcastToRoom(data.roomId, 'drawing:draw', data, socket.id);
  },
  handleDrawingEnd(socket, data, manager) {
    manager.broadcastToRoom(data.roomId, 'drawing:end', data, socket.id);
  },
  handleClearCanvas(socket, data, manager) {
    manager.broadcastToRoom(data.roomId, 'drawing:clear', data, socket.id);
  },
  handleUndo(socket, data, manager) {
    manager.broadcastToRoom(data.roomId, 'drawing:undo', data, socket.id);
  },
  handleRedo(socket, data, manager) {
    manager.broadcastToRoom(data.roomId, 'drawing:redo', data, socket.id);
  }
};*/

// server/socket/handlers/drawingHandler.js
module.exports = (io, socket) => {
  socket.on('drawing', (data) => {
    const { roomId, stroke } = data;
    socket.to(roomId).emit('drawing', stroke); // send to all others in room
  });
};
