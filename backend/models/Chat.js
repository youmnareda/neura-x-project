const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // لو عندك Users، أو سيبها string لو بتستخدم sessionId
  },
  sessionId: String, // لو معندكش تسجيل دخول
  message: String,
  reply: String,
  condition: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', chatSchema);
