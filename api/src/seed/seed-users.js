const md5 = require('md5');
const bcrypt = require('bcrypt');
require('dotenv').config();

const newUsers = [{
  firstName: 'Joe',
  lastName: 'Bloggz',
  username: 'user1',
  password: 'test1',
  viewingPro: '',
  role: 'dev',
},
{
  firstName: 'Bob',
  lastName: 'Martin',
  username: 'user2',
  password: 'test2',
  viewingPro: '',
  role: 'dev',
},
{
  firstName: 'Rich',
  lastName: 'Jones',
  username: 'pm',
  password: 'test3',
  viewingPro: '',
  role: 'pm',
},
];
module.exports = newUsers.map((user) => {
  const salt = bcrypt.genSaltSync(Number(process.env.BCRYPTHASHCOST));
  // generate hash of pass to be saved in db
  const passHash = bcrypt.hashSync(user.password, salt);
  // generate hash based on username, for gravatar art
  const avatarHash = md5(user.username);
  return { ...user, password: passHash, avatarHash };
  // update user object with new credentials
});
