const express = require('express');
const router = express.Router();

const { addUser, removeUser, addRoomToCollabs, getUserCollabs, getUserByUsername } = require('../controllers/userController');
const { validateUserJoin } = require('../middleware/validation');

router.post('/', validateUserJoin, addUser);              // validate user join
router.delete('/:socketId', removeUser);                  // no auth needed
router.post('/add-room-to-collabs', addRoomToCollabs);
router.get('/collabs/:username', getUserCollabs);
router.get("/by-username/:username", getUserByUsername);


module.exports = router;
