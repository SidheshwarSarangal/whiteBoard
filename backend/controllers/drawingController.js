// server/controllers/drawingController.js
const Drawing = require('../models/Drawing');

exports.saveDrawing = async (req, res) => {
  const { roomId, strokeData } = req.body;

  try {
    const drawing = new Drawing({ roomId, strokeData });
    await drawing.save();
    res.status(201).json(drawing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDrawings = async (req, res) => {
  const { roomId } = req.params;

  try {
    const drawings = await Drawing.find({ roomId });
    res.status(200).json(drawings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
