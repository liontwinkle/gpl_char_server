const authSv = require('../../services/auth');

module.exports = async (token) => {
  return await authSv.verifyUser(token);
};