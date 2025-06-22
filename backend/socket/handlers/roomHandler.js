module.exports = {
  handleCreateRoom(socket, data, manager) {
    const roomId = data.roomId;
    manager.addUserToRoom(socket.id, roomId);
    socket.join(roomId);
    socket.emit('room:created', { roomId });
  },

  handleJoinRoom(socket, data, manager) {
    const roomId = data.roomId;
    manager.addUserToRoom(socket.id, roomId);
    socket.join(roomId);

    const users = manager.getRoomUsers(roomId);
    socket.emit('room:joined', { roomId, users });

    const user = manager.connectedUsers.get(socket.id);
    manager.broadcastToRoom(roomId, 'user:joined', user, socket.id);
  },

  handleLeaveRoom(socket, data, manager) {
    manager.removeUserFromRoom(socket);
    socket.leave(data.roomId);
  }
};