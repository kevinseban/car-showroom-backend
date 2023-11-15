const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/message', messageController.sendMessage);
router.get('/getMessage', messageController.getMessages);
router.post('/deleteMessage', messageController.deleteMessage);
router.get('/searchMessages/:searchQuery', messageController.searchMessages);
router.get('/searchMessagesByDate/:searchDate', messageController.searchMessagesByDate);

module.exports = router;
