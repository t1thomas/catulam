// import Vue from 'vue';
// import { ApolloClient } from 'apollo-client';
// import { HttpLink } from 'apollo-link-http';
// import { ApolloLink } from 'apollo-link';
// import { onError } from 'apollo-link-error';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import VueApollo from 'vue-apollo';
// import { setContext } from 'apollo-link-context';
// import { SubscriptionClient } from 'subscriptions-transport-ws';
//
// // Register the VueApollo plugin with Vue.
// Vue.use(VueApollo);
//
// // Create a new HttpLink to connect to your GraphQL API.
// // According to the Apollo docs, this should be an absolute URI.
// const httpLink = new HttpLink({
//   uri: 'http://localhost:7000/graphql',
// });
//
// const wsClient = new SubscriptionClient('ws://localhost:7000/graphql', {
//   reconnect: true,
//   connectionParams: {
//     authToken: localStorage.getItem('catulam_token'),
//   },
// });
//
// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from localstorage if it exists
//   const token = localStorage.getItem('catulam_token');
//
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: token || '',
//     },
//   };
// });
//
// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors) {
//     // graphQLErrors.forEach(({ message, locations, path }) => console.log(
//     //   `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
//     // ));
//     graphQLErrors.forEach((err) => {
//       console.dir(err);
//     });
//   }
//   if (networkError) console.log(`[Network error]: ${networkError}`);
// });
// const link = ApolloLink.from([
//   errorLink,
//   authLink,
//   httpLink,
// ]);
//
//
// // Create the apollo client
// const apolloClient = new ApolloClient({
//   // Tells Apollo to use the link chain with the http link we set up.
//   link,
//   // Handles caching of results and mutations.
//   cache: new InMemoryCache(),
//   // Useful if you have the Apollo DevTools installed in your browser.
//   connectToDevTools: true,
//   networkInterface: wsClient,
//
// });
// Apollo imports
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { concat, split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error';

// Vue imports
import Vue from 'vue';
import VueApollo from 'vue-apollo';

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_URI || 'http://localhost:7000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from localstorage if it exists
  const token = localStorage.getItem('catulam_token');

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token || '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      console.dir(err);
    });
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// Set up subscription
// const wsLink = new WebSocketLink({
//   uri: 'ws://localhost:7000/graphql',
//   options: {
//     reconnect: true,
//   },
//   connectionParams: {
//     authToken: localStorage.getItem('catulam_token'),
//   },
// });

const wsLink = new SubscriptionClient(process.env.VUE_APP_SUB_CLI_URL || 'ws://localhost:7000/graphql', {
  reconnect: true,
  connectionParams: {
    authToken: localStorage.getItem('catulam_token'),
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
  errorLink,
);
const apolloClient = new ApolloClient({
  link: concat(authLink, link),
  cache: new InMemoryCache(),
});

Vue.use(VueApollo, { apolloClient });
Vue.$apolloClient = apolloClient;

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

export default apolloProvider;
