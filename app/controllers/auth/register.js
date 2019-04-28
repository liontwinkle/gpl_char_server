const authSv = require('../../services/auth');

module.exports = async (user) => {
  return await authSv.registerUser(user);
};