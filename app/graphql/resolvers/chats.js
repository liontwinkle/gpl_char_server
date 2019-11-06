const { pubsub } = require('../subscriptions');

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
  },
};
