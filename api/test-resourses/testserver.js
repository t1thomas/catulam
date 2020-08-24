const neo4j = require('neo4j-driver');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const schema = require('../src/graphQL-schema');
const verifyToken = require('../src/verifyAndDecodeToken');

// default port that should be used for test server
const PORT = process.env.GRAPHQL_LISTEN_PORT;

// let driver;
// let server;
const app = express();

const startServer = async () => {
  const driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(
      process.env.NEO4J_USER || 'neo4j',
      process.env.NEO4J_PASSWORD || 'neo4j',
    ),
  );
  const apollo = new ApolloServer({
    context: async ({ req, res }) => {
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
  });
  apollo.applyMiddleware({ app });
  await app.listen({ port: PORT });
};

const stopServer = async () => {
  // await server.close();
  // await driver.close();
};

module.exports = { startServer, stopServer };
