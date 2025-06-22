const User = require('../models/User');

exports.createOrUpdateUser = async (req, res) => {
  const { userId, username, color } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { userId },
      { username, color, lastActive: new Date() },
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};