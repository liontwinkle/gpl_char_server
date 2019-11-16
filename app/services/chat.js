const { chatMessageModel } = require('../mongoose/models/chat-message');
const { chatModel } = require('../mongoose/models/chat');
const ApiError = require('../utils/ApiError');
const { get } = require('lodash');
const { getFields } = require('./utils');
const { makeResponse } = require('../mongoose/utils');

const chatRes = makeResponse;
const populateByCreator = query => query.populate('creator', 'name _id');

exports.createChat = async (chatSettings, userId) => {
  const newChat = new chatModel({ ...chatSettings, creator: userId });
  try {
    await newChat.save();
  } catch (err) {
    throw new ApiError({ message: 'Unable to create a chat', message: 400 });
  }
  const chat = await exports.findChatById(newChat._id);

  return chatRes(chat);
};

exports.findChatById = (id, { withCreator = true } = {}) => {
  let query = chatModel.findById(id);

  if (withCreator) {
    populateByCreator(query);
  }

  return query.exec();
};

exports.deleteChat = async (chatId, userId) => {
  try {
    const res = await chatModel
      .deleteOne({ _id: chatId, creator: userId })
      .exec();
    return !!res.deletedCount;
  } catch (err) {
    throw new ApiError({ message: 'Unable to delete chat', status: 500 });
  }
};

exports.sendMessage = async ({ chatId, message }, userId) => {
  try {
    const newMessage = new chatMessageModel({ message, from: userId });
    const res = await chatModel
      .findOneAndUpdate({ _id: chatId }, { $push: { messages: newMessage } })
      .exec();
    return !!res;
  } catch (err) {
    throw new ApiError({
      message: 'Unable to add message to the chat',
      status: 500,
    });
  }
};

exports.getChats = async ({ fields }) => {
  try {
    const withChatCreator = getFields(get(fields, 'chats.creator'));
    const withMessages = getFields(get(fields, 'chats.messages'), {
      asArray: true,
    });
    const withMessageFrom = getFields(get(fields, 'chats.messages.from'));
    const withChatFields = getFields(fields.chats, {
      nestedFields: { messages: withMessages },
    });
    const query = chatModel.find({}, withChatFields);
    if (withChatCreator) query.populate('creator', withChatCreator);
    if (withMessageFrom) query.populate('messages.from', withMessageFrom);

    const chats = await query.lean().exec();

    return { chats: chats.map(chatRes) };
  } catch (err) {
    throw new ApiError({ message: 'Unable to get all chats', status: 500 });
  }
};
