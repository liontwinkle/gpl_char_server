const mongoose = require('mongoose');
const cfg = require('../config');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
module.exports = () => {
  return new Promise((res, rej) => {
    mongoose.connect(cfg.mongo.url, options, err => {
      if (err) rej(err);
      console.log('Connected to mongoDB');
      res();
    });
  });
};
