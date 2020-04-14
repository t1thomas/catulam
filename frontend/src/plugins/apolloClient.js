import Vue from 'vue';
import ApolloClient from 'apollo-boost';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:7000/graphql',
  // include auth token with requests made TO backend
  fetchOptions: {
    credentials: 'include',
  },
  request: (operation) => {
    // if !'catulam_token' in localStorage, add it
    // if (!localStorage.catulam_token) {
    //   localStorage.setItem('catulam_token', '');
    // }
    const token = localStorage.getItem('catulam_token');

    // adds token to auth header, which is sent to backend
    operation.setContext({
      headers: {
        authorization: token || '',
      },
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('[networkError]', networkError);
    }

    if (graphQLErrors) {
      graphQLErrors.forEach((err) => {
        console.dir(err);
      });
    }
  },

});
Vue.$apolloClient = apolloClient;
