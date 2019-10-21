const mongoose = require('mongoose');
mongoose.set('runValidators', true);

exports.isProd = process.env.NODE_ENV === 'production';
exports.isDev = process.env.NODE_ENV === 'development';

module.exports = exports.isProd
  ? require('./prod')
  : require('./dev');