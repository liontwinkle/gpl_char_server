const mongoose = require('mongoose');
const { chatMessageSchema } = require('.');

const chatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 1,
    },
    creator: {
      ref: 'user',
      type: mongoose.SchemaTypes.ObjectId,
    },
    messages: {
      type: [chatMessageSchema],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
);

const chatModel = mongoose.model('chat', chatSchema);

module.exports = {
  chatSchema,
  chatModel,
};
