const express = require('express');
const mongoInit = require('./mongoose');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const {
  typeDefs,
  resolvers,
  formatError,
  context,
  subscriptions,
} = require('./graphql/');
const http = require('http');
const cfg = require('./config');

const init = async () => {
  await mongoInit();
  const app = express();
  app.use(cors());
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError,
    context,
    subscriptions,
  });
  server.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: cfg.port }, () =>
    console.log(`Going on ${cfg.port}`)
  );
};

init();
