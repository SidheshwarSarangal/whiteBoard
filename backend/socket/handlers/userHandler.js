
module.exports = (io, socket) => {
  socket.on('get_users', (roomId, callback) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    callback(clients); // return user list to caller
  });
};
