const authSchema = require('./schema/auth');
const authResolver = require('./resolvers/auth');
const ApiError = require('../utils/apiError');
const { isProd } = require('../config');

const typeDefs = [authSchema];

const resolvers = [authResolver];

const formatError = err => {
  console.log('Erorr occurred:', err);
  if (err.originalError instanceof ApiError) {
    return { ...err.originalError };
  }
  return isProd ? new ApiError() : err;
};

module.exports = { typeDefs, resolvers, formatError };
