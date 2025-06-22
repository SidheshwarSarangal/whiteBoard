const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  color: { type: String },
  lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);