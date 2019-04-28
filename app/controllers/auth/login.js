const authSv = require('../../services/auth');

module.exports = async (credential) => {
  return await authSv.loginUser(credential);
};