const express = require('express');
const router = express.Router();

const { saveDrawing, getDrawings } = require('../controllers/drawingController');
const verifyToken = require('../middleware/auth');
const { validateDrawingSave } = require('../middleware/validation');

router.post('/', verifyToken, validateDrawingSave, saveDrawing);  // authenticated & validated
router.get('/:roomId', verifyToken, getDrawings);                 // authenticated users only

module.exports = router;
