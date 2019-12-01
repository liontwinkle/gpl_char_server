const { pubsub } = require('../subscriptions');
const chatService = require('../../services/chat');
const { withUser, parseQueryFields } = require('../utils');
const { actions } = require('../subscriptions');

module.exports = {
  ChatListRes: {
    __resolveType(obj) {
      switch (obj.type) {
        case 'ADDED':
          return 'ChatListChatAdded';
        case 'DELETED':
          return 'ChatListChatDeleted';
        default:
          return null;
      }
    },
  },
  ChatsQueryRes: {
    __resolveType(obj) {
      if (Array.isArray(obj.list)) {
        return 'ChatsRes';
      }
      return 'ChatRes';
    },
  },
  Subscription: {
    messageSent: {
      resolve: payload => payload,
      subscribe: () => pubsub.asyncIterator([actions.MESSAGE_SENT]),
    },
    chatList: {
      resolve: payload => payload,
      subscribe: () =>
        pubsub.asyncIterator([actions.CHAT_ADDED, actions.CHAT_DELETED]),
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
      const isDeleted = chatService.deleteChat(chatId, id);
      pubsub.publish(actions.CHAT_DELETED, { type: 'DELETED', chatId });
      return isDeleted;
    }),
    sendMessage: withUser((_, { data }, { user: { id } }) => {
      return chatService.sendMessage(data, id);
    }),
  },
  Query: {
    chats: withUser((_, { chatId }, ctx, ast) => {
      const fields = parseQueryFields(ast);
      if (chatId) {
        return chatService.getOneChat({ fields, chatId });
      }
      return chatService.getChatsList({ fields: fields.list });
    }),
  },
};
