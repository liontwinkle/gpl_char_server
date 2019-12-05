const { PubSub } = require('apollo-server');
const { ApiError } = require('../utils');

exports.pubsub = new PubSub();

exports.subscriptions = {
  path: '/',
  onConnect(connectionParams) {
    if (!connectionParams.token) {
      throw new ApiError({ message: 'Got no token', status: 401 });
    }
    return { connectionParams };
  },
  onDisconnect(_, context) {
    // ? returns onConnect return value, which is wrapped in promise
    context.initPromise.then(d => d);
  },
};

exports.actions = {
  CHAT_MESSAGE_ADDED: 'CHAT_MESSAGE_ADDED',
  CHAT_ADDED: 'CHAT_ADDED',
  CHAT_DELETED: 'CHAT_DELETED',
};
