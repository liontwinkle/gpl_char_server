module.exports = {
  // Authentication 
  register: require('./auth/register'),
  login: require('./auth/login'),
  verify: require('./auth/verify'),
  tokenUpdate: require('./auth/tokenUpdate'),
}