const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const driver = require('./neo4jDriver');
const schema = require('./graphQL-schema');
const verifyToken = require('./authenticate');

require('dotenv').config();

const PORT = process.env.GRAPHQL_LISTEN_PORT;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
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
  if (process.env.CORS_ORIGIN) {
    console.log('20:11');
    console.log(`🚀 Server ready at ${process.env.CORS_ORIGIN}:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ${process.env.CORS_ORIGIN.replace('http', 'ws')}:${PORT}${server.subscriptionsPath}`);
  } else {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
  }
});
