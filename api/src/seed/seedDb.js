const neo4j = require('neo4j-driver');
const newUsers = require('./seed-users');
require('dotenv').config();

console.log(process.env.NEO4J_PASSWORD);
const driver = neo4j.driver(
  process.env.NEO4J_URI || 'http://localhost:7474',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'neo4j',
  ),
);

const initDb = async () => {
  const session = driver.session();
  try {
    // eslint-disable-next-line no-restricted-syntax
    for await (const user of newUsers) {
      await session.run('CREATE (u:User)\n'
                + 'SET u.id = apoc.create.uuid()\n'
                + 'SET u.firstName = $user.firstName\n'
                + 'SET u.lastName = $user.lastName\n'
                + 'SET u.username = $user.username\n'
                + 'SET u.password = $user.password\n'
                + 'SET u.avatar = $user.avatarHash\n'
                + 'SET u.viewingPro = $user.viewingPro\n'
                + 'SET u.role = $user.role\n'
                + 'RETURN u', { user });
    }
  } catch (error) {
    throw new Error(error);
  } finally {
    await session.close();
    await driver.close();
  }
};

module.exports = () => initDb();
