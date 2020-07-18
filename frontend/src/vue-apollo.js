// import Vue from 'vue';
// import VueApollo from 'vue-apollo';
// import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client';
//
// // Install the vue plugin
// Vue.use(VueApollo);
//
// // Name of the localStorage item
// const AUTH_TOKEN = 'apollo-token';
//
// // Http endpoint
// const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000/graphql';
//
// // Config
// const defaultOptions = {
//   // You can use `https` for secure connection (recommended in production)
//   httpEndpoint,
//   // You can use `wss` for secure connection (recommended in production)
//   // Use `null` to disable subscriptions
//   wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:4000/graphql',
//   // LocalStorage token
//   tokenName: AUTH_TOKEN,
//   // Enable Automatic Query persisting with Apollo Engine
//   persisting: false,
//   // Use websockets for everything (no HTTP)
//   // You need to pass a `wsEndpoint` for this to work
//   websocketsOnly: false,
//   // Is being rendered on the server?
//   ssr: false,
//
//   // Override default apollo link
//   // note: don't override httpLink here, specify httpLink options in the
//   // httpLinkOptions property of defaultOptions.
//   // link: myLink
//
//   // Override default cache
//   // cache: myCache
//
//   // Override the way the Authorization header is set
//   // getAuth: (tokenName) => ...
//
//   // Additional ApolloClient options
//   // apollo: { ... }
//
//   // Client local data (see apollo-link-state)
//   // clientState: { resolvers: { ... }, defaults: { ... } }
// };
//
// // Call this in the Vue app file
// export function createProvider(options = {}) {
//   // Create apollo client
//   const { apolloClient, wsClient } = createApolloClient({
//     ...defaultOptions,
//     ...options,
//   });
//   apolloClient.wsClient = wsClient;
//
//   // Create vue apollo provider
//   const apolloProvider = new VueApollo({
//     defaultClient: apolloClient,
//     defaultOptions: {
//       $query: {
//         // fetchPolicy: 'cache-and-network',
//       },
//     },
//     errorHandler(error) {
//       // eslint-disable-next-line no-console
// eslint-disable-next-line max-len
//       console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message);
//     },
//   });
//
//   return apolloProvider;
// }
//
// // Manually call this when user log in
// export async function onLogin(apolloClient, token) {
//   if (typeof localStorage !== 'undefined' && token) {
//     localStorage.setItem(AUTH_TOKEN, token);
//   }
//   if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
//   try {
//     await apolloClient.resetStore();
//   } catch (e) {
//     // eslint-disable-next-line no-console
//     console.log('%cError on cache reset (login)', 'color: orange;', e.message);
//   }
// }
//
// // Manually call this when user log out
// export async function onLogout(apolloClient) {
//   if (typeof localStorage !== 'undefined') {
//     localStorage.removeItem(AUTH_TOKEN);
//   }
//   if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
//   try {
//     await apolloClient.resetStore();
//   } catch (e) {
//     // eslint-disable-next-line no-console
//     console.log('%cError on cache reset (logout)', 'color: orange;', e.message);
//   }
// }
import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client';
import { onError } from 'apollo-link-error';
import { Observable } from 'apollo-link';

Vue.use(VueApollo);

// Name of the localStorage item
const AUTH_TOKEN = process.env.VUE_APP_AUTH_TOKEN;
// if in production env, build custom url otherwise use env variable
const httpEndpoint = process.env.NODE_ENV === 'production' ? `${window.location.origin}:4000/graphql` : process.env.VUE_APP_DEV_GRAPHQL_HTTP;
// Files URL root
export const filesRoot = process.env.VUE_APP_FILES_ROOT || httpEndpoint.substr(0, httpEndpoint.indexOf('/graphql'));

Vue.prototype.$filesRoot = filesRoot;

async function getNewToken() {
  // use fetch API to get refresh token
  return fetch(process.env.VUE_APP_GRAPHQL_HTTP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ query: 'mutation { refreshAccess }' }),
  })
    .then((res) => res.json())
    .then((res) => res.data.refreshAccess.token)
    .then((token) => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN, token);
      }
      return token;
    });
}

const errorLink = onError(({
  graphQLErrors, networkError, operation, forward,
// eslint-disable-next-line consistent-return
}) => {
  // User access token has expired
  if (graphQLErrors.some((e) => e.extensions?.code === 'UNAUTHENTICATED')) {
    // We assume we have both tokens needed to run the async request
    // Let's refresh token through async request
    return new Observable((observer) => {
      getNewToken().then((token) => {
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
      }).catch(async (error) => {
        // If request for refresh token fails,
        // we set currentUser state to null
        // and force user to login page
        // and remove invalid access token
        await Vue.$store.dispatch('removeUser');
        observer.error(error);
        await Vue.$store.dispatch('snackBarOn', error);
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
        message: err,
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
  wsEndpoint: process.env.NODE_ENV === 'production' ? `ws://${window.location.host}:4000/graphql` : process.env.VUE_APP_DEV_GRAPHQL_WS,
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
