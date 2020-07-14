const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

module.exports = async function verifyToken(token) {
  if (token) {
    try {
      console.log(token);
      // return await jwt.verify(token, process.env.JWT_SECRET);
      return await jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    } catch (e) {
      throw new AuthenticationError('Session ended, Please login again');
    }
  } else {
    return null;
  }
};
