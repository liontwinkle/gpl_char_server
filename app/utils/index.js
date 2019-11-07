exports.ApiError = require('./ApiError');

exports.getUserTokenFromRequest = req => {
  const token = req.headers.authorization;
  if (!token || typeof token !== 'string') return;

  const [format, parsedToken] = token.split(' ', 2);
  if (format !== 'JWT' || parsedToken === '') return;

  return parsedToken;
};