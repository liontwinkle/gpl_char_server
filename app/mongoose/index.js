const mongoose = require('mongoose');
const cfg = require('../config');

module.exports = () => {
  return new Promise((res, rej) => {
    mongoose.connect(cfg.mongo.url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }, (err) => {
      if (err) rej(err);
      console.log('Connected to mongoDB');
      res();
    })
  })
};