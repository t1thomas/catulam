const { GraphQLClient } = require('graphql-request');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const setCookie = require('set-cookie-parser');
const initDb = require('../src/seed/seedDb');
const clearDb = require('../src/clearDb/clearDb');
const authScopes = require('../src/authScopes');

const gqlQueries = require('../test-resourses/gql-queries-mutations');

require('dotenv').config();

// schema used for testing is same as production
const httpEndpoint = process.env.GRAPHQL_URI;
beforeAll(async () => {
  await initDb();
});
// clear all db data after tests finish

afterAll(async () => {
  await clearDb();
});

describe('Login as PM', () => {
  // test graphQl client
  const graphQLClient = new GraphQLClient(httpEndpoint, {
    credentials: 'include',
    mode: 'cors',
  });
  // global variables accessible to tests
  let resFull;
  let resData;
  let decoded;
  let parseCookie;
  test('test login response', async () => {
    resFull = await graphQLClient.rawRequest(gqlQueries.LOGIN_USER_graphql_request,
      {
        username: 'pm',
        password: 'test3',
      });
    resData = resFull.data;
    expect(resData).toContainKey(['loginUser']);
    expect(resData.loginUser).toEqual(expect.objectContaining({
      exp: expect.any(Number),
      token: expect.any(String),
    }));
  });
  test('test jwt access token', async () => {
    const { token } = resData.loginUser;
    decoded = await jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
  });
  test('test jwt access token expiration', () => {
    // timeA =  currTime + 60min  timeB =  currTime + 65min
    const timeA = moment().add(60, 'minutes');
    const timeB = moment(timeA).add(5, 'minutes');
    // get exp time from token
    const expTime = moment.unix(decoded.exp);
    // check if expiration falls between timeA and timeB
    const checkExp = expTime.isBetween(timeA, timeB, 'seconds', '[)');
    expect(checkExp).toBe(true);
  });
  test('test jwt access token scopes', () => {
    // scopes that should have been provided
    const pmScopes = authScopes.pm;
    // scopes in token
    const tokenScopes = decoded.scope;
    // check if two arrays contain equal values, in any order.
    expect(tokenScopes).toIncludeSameMembers(pmScopes);
  });
  test('test response cookie jwt', async () => {
    // get cookie from response headers
    const resCookie = resFull.headers.get('Set-Cookie');
    // parse cookie into object
    parseCookie = setCookie.parseString(resCookie);
    // verify jwt and decode
    const jwtCookie = jwt.verify(parseCookie.value, process.env.JWT_SECRET);
    // timeA =  currTime + 7days  timeB =  currTime + 7days & 5 min
    const timeA = moment().add(7, 'days');
    const timeB = moment(timeA).add(5, 'minutes');
    // get exp time from token
    const expTime = moment.unix(jwtCookie.exp);
    // check if expiration falls between timeA and timeB
    const checkExp = expTime.isBetween(timeA, timeB, 'seconds', '[)');
    expect(checkExp).toBe(true);
  });
});
