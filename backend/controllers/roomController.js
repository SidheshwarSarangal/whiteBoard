// server/controllers/roomController.js
const Room = require('../models/Room');

exports.createRoom = async (req, res) => {
  const { roomId, isPrivate } = req.body;

  try {
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room ID already exists' });
    }

    const newRoom = new Room({ roomId, isPrivate });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findOne({ roomId: id });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
