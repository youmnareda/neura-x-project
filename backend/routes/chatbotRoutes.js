const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

router.post('/ask', chatbotController.sendToMedicalChatbot);
router.get('/history', chatbotController.getChatHistory);

module.exports = router;
