const authService = require('../../services/auth');

module.exports = {
  registerUser({ user }) {
    return authService.registerUser(user);
  },
  loginUser({ credentials }) {
    return authService.loginUser(credentials);
  },
};