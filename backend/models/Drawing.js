const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  strokeData: { type: Object, required: true },
  userId: { type: String, required: true },       // 👈 Added
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Drawing', drawingSchema);
