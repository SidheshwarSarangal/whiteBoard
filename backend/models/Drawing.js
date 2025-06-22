const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  userId: { type: String },
  action: { type: String },
  stroke: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Drawing', drawingSchema);