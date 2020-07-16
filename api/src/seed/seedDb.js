const { setContext } = require('apollo-link-context');

const { ApolloClient } = require('apollo-client');
const fetch = require('node-fetch');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const jwt = require('jsonwebtoken');
const authScopes = require('../authScopes');

const dBMutations = require('./seed-mutations');

require('dotenv').config();

// generate admin token, so CreateUser mutation can be used seed the database.
function generateAdminToken() {
  //  token expiration, 2min from current time
  const exp = Math.floor(Date.now() / 1000) + (2 * 60);
  const role = 'admin';
  // get scopes based on user role 'admin'
  const scope = authScopes.admin();
  return jwt.sign({ exp, scope, role }, process.env.JWT_SECRET);
}
const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_URI,
  fetch,
  credentials: 'include',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await generateAdminToken();
  console.log('token ');
  console.log(token);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

client.mutate({
  fetchPolicy: 'no-cache',
  mutation: dBMutations,
}).then((data) => console.log(data))
  .catch((error) => console.error(error));
