const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  canvasData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  drawingHistory: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
roomSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Cleanup utility
roomSchema.statics.cleanupInactiveRooms = function (daysOld) {
  const threshold = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  return this.deleteMany({ updatedAt: { $lt: threshold } });
};

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
