const { GraphQLClient } = require('graphql-request');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const setCookie = require('set-cookie-parser');

const authScopes = require('../src/authScopes');

const gqlQueries = require('./gql-queries-mutations');

require('dotenv').config();

// schema used for testing is same as production
const httpEndpoint = process.env.GRAPHQL_URI;

const graphQLClient = new GraphQLClient(httpEndpoint, {
  credentials: 'include',
  mode: 'cors',
});

module.exports = () => describe('Login as PM', () => {
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
  // test('test response cookie expires value', async () => {
  //   console.log(parseCookie);
  // const expires  = parseCookie.expires;
  // // get cookie from response headers
  // const resCookie = resFull.headers.get('Set-Cookie');
  // // parse cookie into object
  // parseCookie = setCookie.parseString(resCookie);
  // // verify jwt and decode
  // const jwtCookie = jwt.verify(parseCookie.value, process.env.JWT_SECRET);
  // // timeA =  currTime + 7days  timeB =  currTime + 7days & 5 min
  // const timeA = moment().add(7, 'days');
  // const timeB = moment(timeA).add(5, 'minutes');
  // // get exp time from token
  // const expTime = moment.unix(jwtCookie.exp);
  // // check if expiration falls between timeA and timeB
  // const checkExp = expTime.isBetween(timeA, timeB, 'seconds', '[)');
  // expect(checkExp).toBe(true);
  // });
});

// const { exp } = res.loginUser;
//
// // console.log(exp);
// // console.log(decoded);
// const expTime = moment.unix(exp);
// const checkExp = expTime.isBetween(timeA, timeB, 'seconds', '[)'); // true
// console.log(checkExp);
// console.log(expTime);
// console.log(timeA);
// console.log(timeB);
// expect(res).toEqual(expect.objectContaining({
//   locationId: expect.any(Number),
//   geo: expect.any(Array),
//   isFetching: expect.any(Boolean),
// }));
// console.log(res);
// expect(res.data).toMatchSnapshot();
// it('Create a project', async () => {
//   const res = await mutate({
//     mutation: gqlQueries.CREATE_PROJECT,
//     variables: {
//       title: 'Software Project ',
//       desc: 'Some description ',
//       label: 'PRO-1',
//       startDate: '2020-07-23',
//       endDate: '2020-07-27',
//       members: [
//         { id: 'b87c5f80-e964-4a23-a2d9-ba7cb88ed0b5' },
//         { id: 'a8a113ac-5c7b-4689-82b8-cc3c42a711b9' },
//       ],
//     },
//   });
//   expect(res).toMatchSnapshot();
// });

// it('Create 3 tickets', async () => {
//   const res = await mutate({
//     mutation: gqlQueries.CREATE_TICKETS,
//   });
//   expect(res.data).toMatchSnapshot();
// });
//
// it('Create 3 UserStories', async () => {
//   const res = await mutate({
//     mutation: gqlQueries.CREATE_USER_STORY,
//   });
//   expect(res.data).toMatchSnapshot();
// });
//
// it('Create 3 Sprints', async () => {
//   const res = await mutate({
//     mutation: gqlQueries.CREATE_SPRINTS,
//   });
//   expect(res.data).toMatchSnapshot();
// });
//
// it('Link 3 Tickets to UserStories', async () => {
//   const res = await mutate({
//     mutation: gqlQueries.ADD_USER_STORY_TICKETS,
//   });
//   expect(res.data).toMatchSnapshot();
// });
//
// it('Link 3 Tickets to Sprints', async () => {
//   const res = await mutate({
//     mutation: gqlQueries.ADD_SPRINT_TICKETS,
//   });
//   expect(res.data).toMatchSnapshot();
// });
//
// it('Add project data', async () => {
//   const res = await mutate({
//     mutation: gqlQueries.ADD_PROJECT_DATA,
//   });
//   expect(res.data).toMatchSnapshot();
// });
