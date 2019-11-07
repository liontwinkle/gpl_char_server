const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const ApiError = require('../utils/ApiError');
const context = require('./context');
const { subscriptions } = require('./subscriptions');
const { isProd } = require('../config');

const formatError = err => {
  console.log('Erorr occurred:', err);
  if (err.originalError instanceof ApiError) {
    return { ...err.originalError };
  }
  return isProd ? new ApiError() : err;
};

module.exports = {
  typeDefs,
  resolvers,
  formatError,
  context,
  subscriptions,
};
