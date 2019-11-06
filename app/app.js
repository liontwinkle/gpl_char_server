const express = require('express');
const mongoInit = require('./mongoose');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers, formatError } = require('./graphql/');
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
    context: async ctx => {
      const { req, connection } = ctx;
      // todo: check for possible double call, when we connect only through one way
      // todo: most likely it doesn't happen, but still :)
      if (connection) {
        // ? builds context for ws connections(through GQLsubscriptions)
        // ? because they already have connection object from onConnect fn in the subscriptions object below
        return connection.context;
      } else {
        // ? builds context for regular query/mutations
        const token = req.headers.authorization || '';

        return { token };
      }
    },
    subscriptions: {
      path: '/',
      onConnect(connectionParams) {
        if (!connectionParams.token) throw new Error('Got no token');
        return {
          connectionParams,
        };
      },
      onDisconnect(_, context) {
        // ? returns onConnect return value, which is wrapped in promise
        context.initPromise.then(d => d);
      },
    },
  });
  server.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: cfg.port }, () =>
    console.log(`Going on ${cfg.port}`)
  );
};

init();
