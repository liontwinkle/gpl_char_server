const { chatMessageModel } = require('../mongoose/models/chat-message');
const { chatModel } = require('../mongoose/models/chat');
const ApiError = require('../utils/ApiError');
const { get } = require('lodash');
const { getFields } = require('./utils');
const { makeResponse } = require('../mongoose/utils');

const chatRes = makeResponse;
const chatMessageRes = makeResponse;
const populateByCreator = query => query.populate('creator', 'name _id');

exports.createChat = async (chatSettings, userId) => {
  const newChat = new chatModel({ ...chatSettings, creator: userId });
  try {
    await newChat.save();
  } catch (err) {
    throw new ApiError({ message: 'Unable to create a chat', status: 400 });
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
      .findOneAndUpdate(
        { _id: chatId },
        { $push: { messages: newMessage } },
        {
          fields: { messages: { $slice: -1 } },
          new: true
        }
      )
      .populate('messages.from', 'name _id')
      .exec();

    const parsedMessage = chatMessageRes(res.messages[0]);
    return { message: parsedMessage, isSuccess: !!parsedMessage };
  } catch (err) {
    throw new ApiError({
      message: 'Unable to add a message to the chat',
      status: 500,
    });
  }
};

const buildChatsQuery = ({ fields, createQuery }) => {
  const withChatCreator = getFields(get(fields, 'creator'));
  const withMessages = getFields(get(fields, 'messages'), {
    asArray: true,
  });
  const withMessageFrom = getFields(get(fields, 'messages.from'));
  const withChatFields = getFields(fields, {
    nestedFields: { messages: withMessages },
  });
  const query = createQuery(withChatFields);
  if (withChatCreator) query.populate('creator', withChatCreator);
  if (withMessageFrom) query.populate('messages.from', withMessageFrom);
  return query;
};

exports.getChatsList = async ({ fields }) => {
  try {
    const query = buildChatsQuery({
      fields,
      createQuery: withChatFields => chatModel.find({}, withChatFields),
    });
    const chats = await query.lean().exec();
    return { list: chats.map(chatRes) };
  } catch (err) {
    throw new ApiError({ message: 'Unable to get chats list', status: 500 });
  }
};

exports.getOneChat = async ({ fields, chatId }) => {
  try {
    const query = buildChatsQuery({
      fields,
      createQuery: withChatFields => chatModel.findById(chatId, withChatFields),
    });
    const chat = await query.lean().exec();
    return chatRes(chat);
  } catch (err) {
    throw new ApiError({ message: 'Unable to get the chat', status: 500 });
  }
};
