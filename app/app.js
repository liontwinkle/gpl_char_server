const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cfg = require('./config');
const routes = require('./routes');
const mongoInit = require('./mongoose');
const app = express();

const init = async () => {
  await mongoInit();

  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(routes);
  app.listen(cfg.port, () => console.log(`Going on ${cfg.port}`));
};

init();
