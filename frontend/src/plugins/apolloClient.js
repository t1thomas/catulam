import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { concat, split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error';

// Vue imports
import Vue from 'vue';
import VueApollo from 'vue-apollo';


const httpLink = new HttpLink({
  uri: 'http://localhost:7000/graphql',
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
      Vue.$store.dispatch('snackBarOn', err);
    });
  }
  Vue.$store.dispatch('snackBarOn', `[Network error]: ${networkError}`);
});


const wsLink = new SubscriptionClient('ws://localhost:7000/graphql', {
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
