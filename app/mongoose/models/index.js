const chat = require('./chat');
const chatMessage = require('./chat-message');
const user = require('./user');

module.exports = {
  ...user,
  ...chat,
  ...chatMessage,
};
