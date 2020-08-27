const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const neo4j = require('neo4j-driver');
const schema = require('./graphQL-schema');
const verifyToken = require('./verifyAndDecodeToken');
require('dotenv').config();

const PORT = process.env.GRAPHQL_LISTEN_PORT;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

/*
 * Create a Neo4j driver instance to connect to the database
 * using credentials specified as environment variables
 * with fallback to defaults
 */

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'neo4j',
  ),
);
/*
 * Create a new instance of ApolloServer which serves the GraphQL schema
 * and Neo4j driver injected into the context object
 * Generated Database Resolvers to Connect.
 */
const server = new ApolloServer({
  context: async ({ req, res, connection }) => {
    if (connection) {
      const { token } = connection.context;
      return {
        cypherParams: {
          currentUser: await verifyToken(token),
        },
        driver,
        req,
        res,
      };
    }
    const token = req.headers.authorization;
    return {
      cypherParams: {
        currentUser: await verifyToken(token),
      },
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
    path: '/ws',
  },
});

server.applyMiddleware({ app, cors: corsOptions });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at ${process.env.CORS_ORIGIN}:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ${process.env.CORS_ORIGIN.replace('http', 'ws')}:${PORT}${server.subscriptionsPath}`);
});
