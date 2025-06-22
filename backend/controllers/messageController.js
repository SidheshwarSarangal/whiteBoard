// server/controllers/messageController.js
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { roomId, sender, text } = req.body;

  try {
    const message = new Message({ roomId, sender, text });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
