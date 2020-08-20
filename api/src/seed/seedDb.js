const newUsers = require('./seed-users');
const driver = require('../neo4jDriver');

const initializeDatabase = async () => {
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
  }
};

initializeDatabase()
  .then(() => {
    console.log('Database seeding finished!');
  })
  .catch((e) => console.error(e))
  .finally(() => process.exit());
