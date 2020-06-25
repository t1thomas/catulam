const neode = require('neode');
require('dotenv').config();
/*
 * Create a Neo4j driver instance to connect to the database
 * using credentials specified as environment variables
 * with fallback to defaults
 */
module.exports = new neode(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  process.env.NEO4J_USER || 'neo4j',
  process.env.NEO4J_PASSWORD || 'neo4j',
);
