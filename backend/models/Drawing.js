// models/Drawing.js
const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  strokeData: { type: Object, required: true }, // e.g., color, width, points
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Drawing', drawingSchema);
