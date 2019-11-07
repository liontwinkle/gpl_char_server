const { pubsub } = require('../subscriptions');
const chatService = require('../../services/chat');
const { withUser } = require('../utils');

const MESSAGE_SENT = 'MESSAGE_SENT';

module.exports = {
  Subscription: {
    messageSent: {
      resolve: payload => payload,
      subscribe: () => pubsub.asyncIterator([MESSAGE_SENT]),
    },
  },
  Mutation: {
    sendMessage: (_, { message }) => {
      pubsub.publish(MESSAGE_SENT, { id: `id-${Math.random()}`, message });
    },
    createChat: withUser((_, { chatSettings }, ctx) => {
      return chatService.createChat(chatSettings, ctx.user);
    }),
  },
};
