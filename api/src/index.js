const express = require('express');
const { ApolloServer } = require('apollo-server-express');
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
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

const server = new ApolloServer({
  context: async ({ req, res, connection }) => {
    if (connection) {
      const { token } = connection.context;
      return {
        currentUser: await verifyToken(token),
      };
    }
    const token = req.headers.authorization;
    return {
      currentUser: await verifyToken(token),
      driver,
      req,
      res,
    };
  },
  schema,
  subscriptions: {
    onConnect: async (connectionParams) => {
      const token = connectionParams.Authorization;
      return { token };
    },
  },
});

server.applyMiddleware({ app, cors: corsOptions });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log('12:26');
  console.log(corsOptions);
  console.log(process.env.GRAPHQL_LISTEN_PORT);
  console.log(process.env.CORS_ORIGIN);
  console.log(process.env.GRAPHQL_URI);

  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
