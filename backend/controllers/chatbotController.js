const axios = require('axios');
const Chat = require('../models/Chat'); 

exports.sendToMedicalChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    const sessionId = req.headers['x-session-id'] || 'anonymous';

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const response = await axios.post('http://127.0.0.1:5001/chat', { message });

    const data = response.data;


    await Chat.create({
      sessionId,
      message,
      reply: data.response,
      condition: data.condition,
      timestamp: data.timestamp
    });

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error communicating with Python chatbot:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get response from chatbot',
      error: error.message
    });
  }
};


exports.getChatHistory = async (req, res) => {
  try {
    const response = await axios.get('http://127.0.0.1:5001/chat/history');
    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get chat history',
      error: error.message
    });
  }
};
