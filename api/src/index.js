const express = require('express');
const { ApolloServer, PubSub } = require('apollo-server-express');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const driver = require('./neo4jDriver');
const schema = require('./graphQL-schema');
const verifyToken = require('./authenticate');
// set environment variables from ../.env

require('dotenv').config();

const PORT = process.env.GRAPHQL_LISTEN_PORT;
const app = express();

app.use(bodyParser.json());

app.use(cookieParser());
// enable cors
const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true, // <-- REQUIRED backend setting
};

const pubSub = new PubSub();

const server = new ApolloServer({
  schema,
  context: async ({ req, res, connection }) => {
    if (connection) {
      return { ...connection.context, pubSub };
    }
    return {
      driver,
      req,
      res,
      pubSub,
    };
  },
  subscriptions: {
    onConnect: async (connectionParams) => {
      if (connectionParams.authToken) {
        return { currentUser: await verifyToken(connectionParams.authToken) };
      }
      throw new Error('Missing auth token!');
    },
  },
});

server.applyMiddleware({ app, cors: corsOptions });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
