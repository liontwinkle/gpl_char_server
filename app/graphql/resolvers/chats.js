const { pubsub } = require('../subscriptions');
const chatService = require('../../services/chat');
const { withUser, parseQueryFields } = require('../utils');
const { actions } = require('../subscriptions');

module.exports = {
  Subscription: {
    messageSent: {
      resolve: payload => payload,
      subscribe: () => pubsub.asyncIterator([actions.MESSAGE_SENT]),
    },
    chatList: {
      resolve: payload => payload,
      subscribe: () => pubsub.asyncIterator([actions.CHAT_ADDED]),
    },
  },
  Mutation: {
    // sendMessage: (_, { message }) => {
    //   pubsub.publish(MESSAGE_SENT, { id: `id-${Math.random()}`, message });
    // },
    createChat: withUser(async (_, { chatSettings }, { user: { id } }) => {
      const chat = await chatService.createChat(chatSettings, id);
      pubsub.publish(actions.CHAT_ADDED, { type: 'ADDED', chat });
      return chat;
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
