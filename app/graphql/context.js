const authService = require('../services/auth');
const { ApiError, getUserTokenFromRequest } = require('../utils');

const contexHandler = async ({ req, connection }) => {
  if (connection) {
    // ? passes ctx which has been built in onConnect fn in subscriptions object in apolloServer
    return connection.context;
  } else {
    // ? builds context for regular query/mutations
    const parsedToken = getUserTokenFromRequest(req);
    let user = null;
    if (parsedToken) {
      try {
        user = (await authService.verifyUser(parsedToken)).user;
      } catch (err) {
        if (!(err instanceof ApiError)) {
          throw new ApiError({ status: 500 });
        }
      }
    }

    return { user };
  }
};

module.exports = contexHandler;
