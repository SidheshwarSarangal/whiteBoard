module.exports = (io, socket) => {
  socket.on('drawing', ({ roomId, stroke }) => {
    socket.to(roomId).emit('drawing', { stroke }); // ✅ FIXED
  });

  socket.on('drawing_deleted', ({ roomId, strokeId }) => {
    socket.to(roomId).emit('drawing_deleted', strokeId); // ✅ already correct
  });

  socket.on("clear_canvas", ({ roomId }) => {
    io.to(roomId).emit("canvas_cleared");
  });
};
