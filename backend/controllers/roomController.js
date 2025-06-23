// server/controllers/roomController.js
const Room = require('../models/Room');
const bcrypt = require('bcrypt');


// server/controllers/roomController.js

exports.createRoom = async (req, res) => {
  const { roomId, name, isPrivate, owner, description } = req.body;

  try {
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room ID already exists' });
    }

    const newRoom = new Room({
      roomId,
      name,
      isPrivate,
      owner,
      description,
    });

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

exports.getRoomsByOwner = async (req, res) => {
  const { owner } = req.query; // or use req.body if you're sending POST

  try {
    const rooms = await Room.find({ owner });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
  }
};


exports.updateRoomPassword = async (req, res) => {
  const { roomId } = req.params;
  const { password } = req.body;

  if (typeof password !== "string") {
    return res.status(400).json({ message: "Password must be provided as a string" });
  }

  try {
    const room = await Room.findOneAndUpdate(
      { roomId },
      {
        password,          
        isPrivate: true,   
      },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Password updated", room });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Join a room if allowed
exports.joinRoom = async (req, res) => {
  const { roomId, username, password = "" } = req.body;

  try {
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if already allowed
    if (room.allowedUsers.includes(username)) {
      return res.status(200).json({ message: "Already joined", room });
    }

    if (!room.isPrivate) {
      // Public room – directly allow
      room.allowedUsers.push(username);
      await room.save();
      return res.status(200).json({ message: "Joined public room", room });
    } else {
      // Private room – verify password
      if (room.password === password) {
        room.allowedUsers.push(username);
        await room.save();
        return res.status(200).json({ message: "Joined private room", room });
      } else {
        return res.status(401).json({ message: "Incorrect password" });
      }
    }
  } catch (error) {
    console.error("Error joining room:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
