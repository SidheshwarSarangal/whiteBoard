const express = require('express');
const router = express.Router();

const { createRoom, getRoom, getRoomsByOwner, updateRoomPassword, joinRoom } = require('../controllers/roomController');
const verifyToken = require('../middleware/auth');
const { validateRoomCreation } = require('../middleware/validation');

router.post('/', validateRoomCreation, createRoom);       // anyone can create room
router.get('/getRoomsByOwner', getRoomsByOwner);
router.get('/:id', getRoom);                              // public room access
router.get('/private/:id', verifyToken, getRoom);         // private room, only with token
router.put('/rooms/:roomId', updateRoomPassword);
router.post("/join", joinRoom);


module.exports = router;
