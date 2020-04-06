const neo4j = require('neo4j-driver');
require('dotenv').config();
/*
 * Create a Neo4j driver instance to connect to the database
 * using credentials specified as environment variables
 * with fallback to defaults
 */
module.exports = new neo4j.driver(
    process.env.NEO4J_testDb_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(
        process.env.NEO4J_testDb_USER || 'neo4j',
        process.env.NEO4J_testDb_PASSWORD || 'test',
    ),
);

