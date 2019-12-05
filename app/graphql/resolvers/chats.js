const { pubsub } = require('../subscriptions');
const chatService = require('../../services/chat');
const { withUser, parseQueryFields } = require('../utils');
const { actions } = require('../subscriptions');
const { withFilter } = require('graphql-subscriptions');

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
    chatMessages: {
      resolve: payload => payload.message,
      subscribe: withFilter(
        () => pubsub.asyncIterator([actions.CHAT_MESSAGE_ADDED]),
        (payload, variables) => {
          return payload.chatId === variables.chatId;
        }
      ),
    },
    chatList: {
      resolve: payload => payload,
      subscribe: () =>
        pubsub.asyncIterator([actions.CHAT_ADDED, actions.CHAT_DELETED]),
    },
  },
  Mutation: {
    createChat: withUser(async (_, { chatSettings }, { user: { id } }) => {
      const chat = await chatService.createChat(chatSettings, id);
      pubsub.publish(actions.CHAT_ADDED, { type: 'ADDED', chat });
      return chat;
    }),
    deleteChat: withUser((_, { chatId }, { user: { id } }) => {
      const isChatDeleted = chatService.deleteChat(chatId, id);
      if (isChatDeleted) {
        pubsub.publish(actions.CHAT_DELETED, { type: 'DELETED', chatId });
      }
      return isChatDeleted;
    }),
    sendMessage: withUser(async (_, { data }, { user: { id } }) => {
      const { isSuccess, message } = await chatService.sendMessage(data, id);
      if (isSuccess) {
        pubsub.publish(actions.CHAT_MESSAGE_ADDED, {
          chatId: data.chatId,
          message,
        });
      }
      return isSuccess;
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
