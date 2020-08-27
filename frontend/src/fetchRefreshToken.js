import { GraphQLClient } from 'graphql-request';
import gqlQueries from './graphql/gql-queries';

const httpEndpoint = process.env.NODE_ENV === 'production' ? `${window.location.origin}:4000/graphql` : process.env.VUE_APP_DEV_GRAPHQL_HTTP;

const AUTH_TOKEN = process.env.VUE_APP_AUTH_TOKEN;

export default async function refreshToken() {
  const graphQLClient = new GraphQLClient(httpEndpoint, {
    credentials: 'include',
    mode: 'cors',
  });
  return graphQLClient.request(gqlQueries.REFRESH_TOKEN_graphql_request).then((response) => {
    const { token } = response.refreshAccess;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN, token);
    }
    return token;
  }).catch(() => {
    throw new Error('Invalid Token, unable to access resource');
  });
}
