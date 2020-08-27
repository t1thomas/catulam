const gql = require('graphql-tag');

const gqlQueries = {
  LOGIN_USER: gql`mutation($username: String!, $password: String!) {
    loginUser(username: $username, password: $password)
  }`,
  LOGIN_USER_graphql_request: /* GraphQL */`mutation($username: String!, $password: String!) {
    loginUser(username: $username, password: $password)
  }`,
};
module.exports = gqlQueries;
