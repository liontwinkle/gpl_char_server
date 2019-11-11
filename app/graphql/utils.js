const ApiError = require('../utils/ApiError');

exports.withUser = resolver => (...args) => {
  const ctx = args[2];
  if (!ctx.user)
    throw new ApiError({
      message: 'You must provide a valid token to access this route',
      status: 401,
    });
  return resolver(...args);
};
