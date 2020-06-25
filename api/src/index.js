const express = require('express');
const { ApolloServer, AuthenticationError, PubSub } = require('apollo-server-express');
const http = require('http');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const driver = require('./neo4jDriver');
const schema = require('./graphQL-schema');
// set environment variables from ../.env

require('dotenv').config();

const PORT = process.env.GRAPHQL_LISTEN_PORT;
const app = express();
app.use(bodyParser.json());

// verify JWT sent from client

async function verifyToken(token) {
  if (token) {
    try {
      return await jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      throw new AuthenticationError('Please sign in again');
    }
  }
}
const pubSub = new PubSub();

const server = new ApolloServer({
  schema,
  context: async ({ req, connection }) => {
    if (connection) {
      return { ...connection.context, pubSub };
    }
    return {
      driver,
      cypherParams: await verifyToken(req.headers.authorization),
      req,
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

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
