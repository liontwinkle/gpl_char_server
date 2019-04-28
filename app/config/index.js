const mongoose = require('mongoose');
mongoose.set('runValidators', true);

module.exports = process.env.NODE_ENV === 'production'
  ? require('./prod')
  : require('./dev');