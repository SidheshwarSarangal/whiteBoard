// config/socket.js
const socketManager = require('../socket/socketManager');

module.exports = (io) => {
  socketManager(io);
};
