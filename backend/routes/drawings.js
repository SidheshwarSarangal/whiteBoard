const express = require('express');
const router = express.Router();
const { saveDrawing, getDrawings, deleteDrawingById, clearAllDrawings } = require('../controllers/drawingController');
const verifyToken = require('../middleware/auth');
const { validateDrawingSave } = require('../middleware/validation');

router.post('/', verifyToken, validateDrawingSave, saveDrawing);
router.get('/:roomId', verifyToken, getDrawings);
router.delete('/:id', verifyToken, deleteDrawingById);
router.delete("/all/:roomId", verifyToken, clearAllDrawings);


module.exports = router;
