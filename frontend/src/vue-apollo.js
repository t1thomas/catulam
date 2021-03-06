import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client';
import { onError } from 'apollo-link-error';
import { Observable } from 'apollo-link';
import refreshToken from './fetchRefreshToken';

Vue.use(VueApollo);

// Name of the localStorage item
const AUTH_TOKEN = process.env.VUE_APP_AUTH_TOKEN;
// if in production env, build custom url otherwise use env variable
const httpEndpoint = process.env.NODE_ENV === 'production' ? `${window.location.origin}/graphql` : process.env.VUE_APP_DEV_GRAPHQL_HTTP;
// Files URL root
export const filesRoot = process.env.VUE_APP_FILES_ROOT || httpEndpoint.substr(0, httpEndpoint.indexOf('/graphql'));

Vue.prototype.$filesRoot = filesRoot;

const errorLink = onError(({
  graphQLErrors, networkError, operation, forward,
// eslint-disable-next-line consistent-return
}) => {
  // User access token has expired
  if (graphQLErrors.some((e) => e.extensions?.code === 'UNAUTHENTICATED')) {
    // We assume we have both tokens needed to run the async request
    // Let's refresh token through async request
    return new Observable((observer) => {
      refreshToken().then((token) => {
        const { headers } = operation.getContext();
        operation.setContext({
          headers: {
            ...headers,
            Authorization: token !== null ? `Bearer ${token}` : '',
          },
        });
      }).then(() => {
        const subscriber = {
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        };

        // Retry last failed request
        forward(operation).subscribe(subscriber);
      }).catch((error) => {
        observer.error(error);
        // If request for refresh token fails,
        // we set currentUser state to null
        // and force user to login page
        // and remove invalid access token
        Vue.$store.dispatch('removeUser');
        // await Vue.$store.dispatch('snackBarOn', error);
      });
    });
  }
  if (networkError) {
    Vue.$store.dispatch('snackBarOn', {
      message: `[Network error]: ${networkError}`,
      type: 'error',
    });
  }
  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      Vue.$store.dispatch('snackBarOn', {
        message: err.message,
        type: 'error',
      });
    });
  }
});

// Config
const defaultOptions = {
  // You can use `https` for secure connection (recommended in production)
  httpEndpoint,
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  // if in production env, build custom url otherwise use env variable

  wsEndpoint: process.env.NODE_ENV === 'production' ? `ws://${window.location.host}/ws` : process.env.VUE_APP_DEV_GRAPHQL_WS,

  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,
  link: errorLink,
  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  httpLinkOptions: {
    credentials: 'include',
  },
};

// Create apollo client
export const { apolloClient, wsClient } = createApolloClient({
  ...defaultOptions,
});
apolloClient.wsClient = wsClient;
// Call this in the Vue app file
export function createProvider() {
  // Create vue apollo provider
  return new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      },
    },
  });
}

// Manually call this when user log in
export async function onLogin(client, token) {
  if (typeof localStorage !== 'undefined' && token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }
  if (client.wsClient) restartWebsockets(apolloClient.wsClient);
  try {
    await apolloClient.resetStore();
  } catch (e) {
    Vue.$store.dispatch('snackBarOn', {
      message: e,
      type: 'error',
    });
  }
}

// Manually call this when user log out
export async function onLogout(client) {
  /* remove token right away, s even if the database
operation fails the client no longer has a token
 */
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN);
  }
  // run logout mutation
  await Vue.$store.dispatch('logoutUser');
  // reset webSocket connections
  if (client.wsClient) restartWebsockets(apolloClient.wsClient);
  try {
    await apolloClient.resetStore();
  } catch (e) {
    Vue.$store.dispatch('snackBarOn', {
      message: e,
      type: 'error',
    });
  }
}
