const { setContext } = require('apollo-link-context');

const { ApolloClient } = require('apollo-client');
const fetch = require('node-fetch');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const jwt = require('jsonwebtoken');
const dBMutations = require('./seed-mutations');

require('dotenv').config();

function generateToken() {
  //  token expiration, 2min from current time
  const exp = Math.floor(Date.now() / 1000) + (2 * 60);
  const roles = 'admin';
  const scope = 'User:Create';
  return jwt.sign({ exp, scope, roles }, process.env.JWT_SECRET);
}
const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_URI,
  fetch,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = generateToken();
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
// const client = new ApolloClient({
//   link: new HttpLink({
//     fetch,
//   }),
//   cache: new InMemoryCache(),
// });

client.mutate({
  fetchPolicy: 'no-cache',
  mutation: dBMutations,
}).then((data) => console.log(data))
  .catch((error) => console.error(error));
