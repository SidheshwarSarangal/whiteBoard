// models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  isPrivate: { type: Boolean, default: false },
  allowedUsers: [{ type: String }], // optional: for access control
});

module.exports = mongoose.model('Room', roomSchema);
