const express = require('express');
const router = express.Router();
const { saveDrawing, getDrawings, deleteDrawingById } = require('../controllers/drawingController');
const verifyToken = require('../middleware/auth');
const { validateDrawingSave } = require('../middleware/validation');

router.post('/', verifyToken, validateDrawingSave, saveDrawing);
router.get('/:roomId', verifyToken, getDrawings);
router.delete('/:id', verifyToken, deleteDrawingById);

module.exports = router;
