const express = require('express');
const router = express.Router();

const { sendMessage, getMessages } = require('../controllers/messageController');
const verifyToken = require('../middleware/auth');
const { validateMessage } = require('../middleware/validation');

router.post('/', verifyToken, validateMessage, sendMessage);      // authenticated & validated
router.get('/:roomId', verifyToken, getMessages);                 // only room members

module.exports = router;
