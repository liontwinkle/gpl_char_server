const express = require('express');
const mongoInit = require('./mongoose');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers, formatError } = require('./graphql/');
const cfg = require('./config');

const init = async () => {
  await mongoInit();
  const app = express();
  app.use(cors());
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError
  });
  server.applyMiddleware({ app });
  app.listen({ port: cfg.port }, () => console.log(`Going on ${cfg.port}`));
};

init();
