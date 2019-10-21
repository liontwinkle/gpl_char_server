const express = require('express');
const mongoInit = require('./mongoose');
const graphqlHTTP = require('express-graphql');
const { schema, rootValue } = require('./graphql/');
const cfg = require('./config');
const ApiError = require('./utils/apiError');

const init = async () => {
  await mongoInit();

  const app = express();
  app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
    customFormatErrorFn: (error) => {
      const { originalError } = error;
      if (originalError instanceof ApiError) {
        return error.originalError;
      }
      return error;
    }
  }));
  app.listen(cfg.port, () => console.log(`Going on ${cfg.port}`));
};

init();
