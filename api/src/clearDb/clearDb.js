const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'neo4j',
  ),
);

const clearDb = async () => {
  const session = driver.session();
  try {
    await session.run('MATCH (n) DETACH DELETE n');
    console.log('Database emptied!');
  } catch (error) {
    throw new Error(error);
  } finally {
    await session.close();
    await driver.close();
  }
};

module.exports = () => clearDb();
