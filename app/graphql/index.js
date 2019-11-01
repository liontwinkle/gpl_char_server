const authSchema = require('./schema/auth');
const authResolver = require('./resolvers/auth');
const ApiError = require('../utils/apiError');
const { isProd } = require('../config');

const typeDefs = [authSchema];

const resolvers = [authResolver];

const formatError = err => {
  if (err.originalError instanceof ApiError) {
    return { ...err.originalError };
  }
  return isProd ? { message: err.message } : err;
};

module.exports = { typeDefs, resolvers, formatError };
