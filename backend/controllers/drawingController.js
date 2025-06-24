const Drawing = require('../models/Drawing');

exports.saveDrawing = async (req, res) => {
  const { roomId, strokeData } = req.body;

  try {
    const drawing = new Drawing({
      roomId,
      strokeData,
      userId: req.user.id,        // 👈 Now recording userId
    });
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

exports.deleteDrawingById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Drawing.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted successfully", deleted });
  } catch (err) {
    res.status(500).json({ message: "Error deleting", error: err.message });
  }
};

exports.clearAllDrawings = async (req, res) => {
  try {
    await Drawing.deleteMany({ roomId: req.params.roomId });
    res.status(200).json({ message: 'All drawings deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete drawings' });
  }
};