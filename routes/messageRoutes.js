const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/message', messageController.sendMessage);
router.get('/getMessage', messageController.getMessages);
router.post('/deleteMessage', messageController.deleteMessage);

module.exports = router;
