import ApolloClient from 'apollo-boost';

export default new ApolloClient({
  uri: process.env.VUE_APP_GRAPHQL_URI || 'http://localhost:7000/graphql',
});
