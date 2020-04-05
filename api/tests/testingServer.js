const { ApolloServer } = require('apollo-server-express');
const {createTestClient} = require('apollo-server-testing');
const driver = require('./testDb/testDbNeo4jDriver');

// schema used for testing is same as production
const schema = require('../src/graphQL-schema');

const server = new ApolloServer({
    context: { driver },
    schema,
});

const { query, mutate } = createTestClient(server);
// export testing client
module.exports = createTestClient(server);
