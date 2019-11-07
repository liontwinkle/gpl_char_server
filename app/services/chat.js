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

exports.createChat = async (chatSettings, userData) => {
  const newChat = new chatModel({ ...chatSettings, creator: userData.id });
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
