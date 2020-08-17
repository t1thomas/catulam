const md5 = require('md5');
const bcrypt = require('bcrypt');
const newUsers = require('./seed-users');
const driver = require('../neo4jDriver');

newUsers.forEach(async (user) => {
  const session = driver.session();
  try {
    const salt = bcrypt.genSaltSync(Number(process.env.BCRYPTHASHCOST));
    // generate hash of pass to be saved in db
    const passHash = bcrypt.hashSync(user.password, salt);
    // generate hash based on username, for gravatar art
    const avatarHash = await md5(user.username);
    // update user object with new credentials before pushing to DB
    Object.assign(user, {
      password: passHash,
      avatarHash,
    });
    // run cypher query using driver
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
  } catch (e) {
    throw new Error(e);
  } finally {
    await session.close();
  }
});
