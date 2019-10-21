const authService = require("../../services/auth");

module.exports = {
  Mutation: {
    registerUser(_, { user }) {
      return authService.registerUser(user);
    },
  },
  Query: {
    loginUser: (_, { credentials }) => {
      return authService.loginUser(credentials);
    },
    verifyUser(_, { token }) {
      return authService.verifyUser(token);
    },
    updateUserToken(_, { token }) {
      return authService.tokenUpdate(token);
    },
  },
};
