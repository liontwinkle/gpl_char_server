const { pubsub } = require('../subscriptions');
const chatService = require('../../services/chat');
const { withUser, parseQueryFields } = require('../utils');

const MESSAGE_SENT = 'MESSAGE_SENT';

module.exports = {
  Subscription: {
    messageSent: {
      resolve: payload => payload,
      subscribe: () => pubsub.asyncIterator([MESSAGE_SENT]),
    },
  },
  Mutation: {
    // sendMessage: (_, { message }) => {
    //   pubsub.publish(MESSAGE_SENT, { id: `id-${Math.random()}`, message });
    // },
    createChat: withUser((_, { chatSettings }, { user: { id } }) => {
      return chatService.createChat(chatSettings, id);
    }),
    deleteChat: withUser((_, { chatId }, { user: { id } }) => {
      return chatService.deleteChat(chatId, id);
    }),
    sendMessage: withUser((_, { data }, { user: { id } }) => {
      return chatService.sendMessage(data, id);
    }),
  },
  Query: {
    chats: withUser((_, data, ctx, ast) => {
      const fields = parseQueryFields(ast);
      return chatService.getChats({ fields });
    }),
  },
};
