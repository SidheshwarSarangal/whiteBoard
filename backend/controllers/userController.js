// server/controllers/userController.js
const User = require('../models/User');

exports.addUser = async (req, res) => {
  const { username, socketId, roomId } = req.body;

  try {
    const user = new User({ username, socketId, roomId });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeUser = async (req, res) => {
  const { socketId } = req.params;

  try {
    const user = await User.findOneAndDelete({ socketId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.addRoomToCollabs = async (req, res) => {
  const { username, roomId } = req.body;

  if (!username || !roomId) {
    return res.status(400).json({ message: 'Username and Room ID are required.' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { $addToSet: { collabs: roomId } }, // avoids duplicates
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Room added to collabs.', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserCollabs = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ collabs: user.collabs || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      username: user.username,
      joinedAt: user.joinedAt,
      collabs: user.collabs || [],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
