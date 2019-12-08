const mongoose = require('mongoose');
mongoose.set('runValidators', true);

exports.isProd = process.env.NODE_ENV === 'production';
exports.isDev = process.env.NODE_ENV === 'development';

const cfg = {
  port: Number(process.env.PORT),
  secret: process.env.SECRET,
  mongo: {
    url: process.env.MONGO_URL,
  },
  token: {
    defaultTokenExpiration: process.env.TOKEN_DEFAULT_EXPR,
    onUpdateTokenExpiration: process.env.TOKEN_ON_UPDATE_EXPR,
  },
};

module.exports = cfg;
