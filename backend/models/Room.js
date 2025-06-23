// models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isPrivate: { type: Boolean, default: false },
  owner: { type: String, required: true },
  description: { type: String, default: "" },
  allowedUsers: [{ type: String }],
  password: { type: String, default: "" }, // ✅ Optional password field
});

module.exports = mongoose.model('Room', roomSchema);
