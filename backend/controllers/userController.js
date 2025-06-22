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
