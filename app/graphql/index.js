const { mergeTypes } = require('merge-graphql-schemas');
const authSchema = require('./schema/auth');
const authResolver = require('./resolvers/auth');
const chatsSchema = require('./schema/chats');
const chatsResolver = require('./resolvers/chats');
const ApiError = require('../utils/apiError');
const { isProd } = require('../config');

const typeDefs = mergeTypes([authSchema, chatsSchema]);

const resolvers = [authResolver, chatsResolver];

const formatError = err => {
  console.log('Erorr occurred:', err);
  if (err.originalError instanceof ApiError) {
    return { ...err.originalError };
  }
  return isProd ? new ApiError() : err;
};

module.exports = { typeDefs, resolvers, formatError };
