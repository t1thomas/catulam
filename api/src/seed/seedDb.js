const { ApolloClient } = require('apollo-client');
const fetch = require('node-fetch');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const dBMutations = require('./seed-mutations');

require('dotenv').config();

const httpLink = createHttpLink({
    uri: process.env.GRAPHQL_URI,
    fetch: fetch
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

client.mutate({
    fetchPolicy: 'no-cache',
    mutation: dBMutations,
}).then((data) => console.log(data))
    .catch((error) => console.error(error));
