// server/controllers/authController.js
const User = require('../models/User');
const { generateToken } = require('../utils/authUtils');

exports.signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already taken' });

    const user = new User({ username, password });
    await user.save();

    const token = generateToken({ id: user._id, username: user.username });
    res.status(201).json({ user: user.username, token });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user._id, username: user.username });
    res.status(200).json({ user: user.username, token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
