const express = require('express');
const router = express.Router();

const { addUser, removeUser } = require('../controllers/userController');
const { validateUserJoin } = require('../middleware/validation');

router.post('/', validateUserJoin, addUser);              // validate user join
router.delete('/:socketId', removeUser);                  // no auth needed

module.exports = router;
