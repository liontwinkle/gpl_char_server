const { chatModel } = require('../mongoose/models');
const ApiError = require('../utils/ApiError');

const chatRes = chat => {
  const res = {
    id: chat._id,
    name: chat.name,
  };
  if (chat.creator) {
    res.creator = {
      id: chat.creator._id,
      name: chat.creator.name,
    };
  }
  return res;
};

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
    query.populate('creator', 'name _id');
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
    throw new ApiError({ message: 'Unable to delete chat', status: 400 });
  }
};
