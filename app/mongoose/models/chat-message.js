const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  message: String,
  from: { ref: 'user', type: mongoose.Types.ObjectId },
});

const chatMessageModel = mongoose.model('chatmessage', chatMessageSchema);

module.exports = {
  chatMessageSchema,
  chatMessageModel,
};
