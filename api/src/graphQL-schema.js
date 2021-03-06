const { GraphQLJSON } = require('graphql-type-json');
const { PubSub, withFilter, AuthenticationError } = require('apollo-server-express');
const { makeAugmentedSchema, neo4jgraphql } = require('neo4j-graphql-js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const neode = require('./neode');
const authScopes = require('./authScopes');
const verifyToken = require('./verifyAndDecodeToken');

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql')).toString('utf-8');

require('dotenv').config();

const pubSub = new PubSub();

// name of the cookie that will be set as refresh token
const cookieName = 'catulam_token';

function createAccessToken(id, role) {
  //  token expiration, one hour from current time
  const exp = Math.floor(Date.now() / 1000) + (60 * 60);

  // get scopes based on user role
  const scope = authScopes[role];
  // returns token string
  return ({
    token: jwt.sign({
      exp, id, role, scope,
    }, process.env.JWT_SECRET),
    exp,
  });
}
function createRefreshToken(id) {
  //  token expiration, 7 days from current time
  const exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7);
  // returns token string
  return ({
    token: jwt.sign({
      exp, id,
    }, process.env.JWT_SECRET),
    exp,
  });
}

function generateTokens(user) {
  return new Promise((resolve) => {
    // console.log('generateTokens');
    // gather id and role property from user object
    const { id, role } = user;
    //  token expiration, 7 days from current time
    const refToken = createRefreshToken(id);
    const accToken = createAccessToken(id, role);
    // returns token string
    resolve({ refToken, accToken });
  });
}
function validatePass(pass, user) {
  return new Promise((resolve, reject) => {
    // console.log('validatePass');
    bcrypt.compare(pass, user.password, (error, res) => {
      if (error || res === false) {
        reject(new Error());
      } else {
        resolve(user);
      }
    });
  });
}
const resolvers = {
  JSON: GraphQLJSON,
  User: {
    fullName(obj) {
      return `${obj.firstName} ${obj.lastName}`;
    },
  },
  Subscription: {
    tickUpdate: {
      subscribe: withFilter(() => pubSub.asyncIterator('TICKET_UPDATE'),
        (payload, variables) => payload.tickUpdate.project.id === variables.project.id),
    },
    tickDelete: {
      subscribe: withFilter(() => pubSub.asyncIterator('TICKET_DELETE'),
        (payload, variables) => payload.tickDelete.project.id === variables.project.id),
    },
    uSUpdate: {
      subscribe: withFilter(() => pubSub.asyncIterator('USER_STORY_UPDATE'),
        (payload, variables) => payload.uSUpdate.project.id === variables.project.id),
    },
    uSDelete: {
      subscribe: withFilter(() => pubSub.asyncIterator('USER_STORY_DELETE'),
        (payload, variables) => payload.uSDelete.project.id === variables.project.id),
    },
    spUpdate: {
      subscribe: withFilter(() => pubSub.asyncIterator('SPRINT_UPDATE'),
        (payload, variables) => payload.spUpdate.project.id === variables.project.id),
    },
    spDelete: {
      subscribe: withFilter(() => pubSub.asyncIterator('SPRINT_DELETE'),
        (payload, variables) => payload.spDelete.project.id === variables.project.id),
    },
    removeProMem: {
      subscribe: withFilter(() => pubSub.asyncIterator('REMOVE_PRO_MEMBER'),
        (payload, variables) => payload.removeProMem.id === variables.user.id),
    },
    addProMem: {
      subscribe: withFilter(() => pubSub.asyncIterator('ADD_PRO_MEMBER'),
        (payload, variables) => payload.addProMem.id === variables.user.id),
    },
  },
  Token: {
    ttl(obj) {
      // the apoc generated ttl value is in 'ms', which will through an error as
      // Int cannot represent value greater than 32-bit signed integer
      // so this resolver divides value by 1000 to show timestamp in 's'
      return Math.round(obj.ttl / 1000);
    },
  },
  Query: {
    getCurrentUser: async (object, params, ctx, resolveInfo) => {
      if (!ctx.cypherParams.currentUser) {
        console.log('getCurrentUser');
        throw new AuthenticationError('No Token');
      }
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
  },
  Mutation: {
    refreshAccess: async (object, params, ctx, resolveInfo) => {
      console.log('refreshAccess');
      try {
        // get refresh token from cookie
        const oldTokenString = ctx.req.cookies[cookieName];
        if (oldTokenString === undefined) {
          // return nothing (silent refresh) if no token was found
          return new Error('No Refresh Token');
        }
        const { id } = await verifyToken(oldTokenString);
        return neode.cypher(
          'MATCH (u:User {id: $id})-[rel:JWT]->(t: Token {token: $oldTokenString}) RETURN u', { id, oldTokenString },
        ).then((result) => result.records[0].get('u').properties)
          .then((user) => generateTokens(user))
          .then((tokens) => {
            const { refToken, accToken } = tokens;
            // update the params so, cypher query contains token and exp date to insert in db
            Object.assign(params, {
              oldTokenString,
              id,
              refTokenString: refToken.token,
              refTokenExp: refToken.exp,
              accTokenObj: accToken,
            });
            // set refresh token in response header
            ctx.res.cookie(cookieName, refToken.token, {
              httpOnly: true,
              // set cookie expires in response header
              expires: new Date(refToken.exp * 1000), // * 1000 as time in milliseconds is required
            });
            return neo4jgraphql(object, params, ctx, resolveInfo);
          });
      } catch (e) {
        throw new Error(e);
      }
    },
    logout: async (object, params, ctx, resolveInfo) => {
      try {
        // get refresh token from cookie
        const oldTokenString = ctx.req.cookies[cookieName];
        if (oldTokenString === undefined) {
          // return nothing (silent refresh) if no token was found
          return false;
        }
        const { id } = await verifyToken(oldTokenString);
        Object.assign(params, {
          oldTokenString,
          id,
        });
        // reset the cookie in response as null
        ctx.res.cookie(cookieName, null, {
          httpOnly: true,
          // set cookie expires in response header
          expires: new Date('1970-01-01T00:00:00'), // date in the past
        });
        // remove the token from db
        return neo4jgraphql(object, params, ctx, resolveInfo);
      } catch (e) {
        throw new Error(e);
      }
    },
    loginUser: async (object, params, ctx, resolveInfo) => neode.cypher(
      'MATCH (u:User {username: $username}) RETURN u', { username: params.username },
    )
      .then((result) => result.records[0].get('u').properties)
      .then((user) => validatePass(params.password, user))
      .then((user) => generateTokens(user))
      .then((tokens) => {
        const { refToken, accToken } = tokens;
        // update the params so, cypher query contains token and exp date to insert in db
        Object.assign(params, {
          refTokenString: refToken.token,
          refTokenExp: refToken.exp,
          accTokenObj: accToken,
        });
        // set refresh token in response header
        ctx.res.cookie(cookieName, refToken.token, {
          httpOnly: true,
          // set cookie expires in response header
          expires: new Date(refToken.exp * 1000), // * 1000 as time in milliseconds is required
        });
        return neo4jgraphql(object, params, ctx, resolveInfo);
      })
      .catch((err) => {
        console.log(err);
        throw new Error('Invalid username/password');
      }),
    CreateProject: async (object, params, ctx, resolveInfo) => {
      try {
        const currUserId = ctx.cypherParams.currentUser.id;
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        // get added members
        const { members } = result;
        members.forEach((mem) => {
          if (mem.id !== currUserId) {
            pubSub.publish('ADD_PRO_MEMBER', { addProMem: mem });
          }
        });
        console.log(params);
        return result;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    },
    AddProjectMember: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('ADD_PRO_MEMBER', { addProMem: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    StartToSprint: async (object, params, ctx, resolveInfo) => {
      try {
        // console.log(object);
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('TICKET_UPDATE', { tickUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    SprintToStart: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('TICKET_UPDATE', { tickUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    TicketLocSwitch: async (object, params, ctx, resolveInfo) => {
      const session = ctx.driver.session();
      try {
        // construct cypher query based on arguments provided
        // run cypher query using driver
        if (params.uStoryRemove !== undefined) {
          await session.run(
            'MATCH (:UserStory {id: $uStoryRemove.id})-[rel:SUB_TASK]->(:Ticket {id: $tick.id})'
              + ' DELETE rel',
            { tick: params.tick, uStoryRemove: params.uStoryRemove },
          );
        }
        if (params.uStoryAdd !== undefined) {
          await session.run(
            'MATCH (t: Ticket {id: $tick.id}), (us: UserStory {id: $uStoryAdd.id})'
              + ' CREATE (us)-[:SUB_TASK]->(t)',
            { tick: params.tick, uStoryAdd: params.uStoryAdd },
          );
        }
        if (params.sprintRemove !== undefined) {
          await session.run(
            'MATCH (:Sprint {id: $sprintRemove.id})-[rel:SPRINT_TASK]->(:Ticket {id: $tick.id})'
              + ' DELETE rel',
            { tick: params.tick, sprintRemove: params.sprintRemove },
          );
        }
        if (params.sprintAdd !== undefined) {
          await session.run(
            'MATCH (t: Ticket {id: $tick.id}), (sp: Sprint {id: $sprintAdd.id})'
              + ' CREATE (sp)-[:SPRINT_TASK]->(t)',
            { tick: params.tick, sprintAdd: params.sprintAdd },
          );
        }
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('TICKET_UPDATE', { tickUpdate: result });
        return neo4jgraphql(object, params, ctx, resolveInfo);
      } catch (e) {
        throw new Error(e);
      } finally {
        await session.close();
      }
    },
    UpdateTicket: async (object, params, ctx, resolveInfo) => {
      const session = ctx.driver.session();
      try {
        // construct cypher query based on arguments provided
        const paramString = Object.keys(params).reduce((arr, key) => {
          if (key !== 'tick') {
            arr.push(`${key}:$params.${key}`);
          }
          return arr;
        }, []).join(', ');
        // run cypher query using driver
        await session.run(
          'MATCH (t: Ticket {id: $params.tick.id})'
            + ` SET t += { ${paramString} }`, {
            params,
          },
        );
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('TICKET_UPDATE', { tickUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      } finally {
        await session.close();
      }
    },
    UpdateSprint: async (object, params, ctx, resolveInfo) => {
      const session = ctx.driver.session();
      try {
        // construct cypher query based on arguments provided
        const paramString = Object.keys(params).reduce((arr, key) => {
          if (key !== 'sprint') {
            arr.push(`${key}:$params.${key}`);
          }
          return arr;
        }, []).join(', ');
        // run cypher query using driver
        await session.run(
          'MATCH (sp: Sprint {id: $params.sprint.id})'
            + ` SET sp += { ${paramString} }`, {
            params,
          },
        );
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('SPRINT_UPDATE', { spUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      } finally {
        await session.close();
      }
    },
    UpdateUserStory: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('USER_STORY_UPDATE', { uSUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    CreateUserStory: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('USER_STORY_UPDATE', { uSUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    AddTicketComments: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('TICKET_UPDATE', { tickUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    AddTicketCommits: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('TICKET_UPDATE', { tickUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    UpdateTicketAssignee: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('TICKET_UPDATE', { tickUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    RemoveTicketAssignee: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('TICKET_UPDATE', { tickUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    CreateTicket: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('TICKET_UPDATE', { tickUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    DeleteTicket: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('TICKET_DELETE',
          {
            tickDelete: {
              id: result.id,
              project: { id: params.project.id },
            },
          });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    DeleteUserStory: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('USER_STORY_DELETE',
          {
            uSDelete: {
              id: result.id,
              project: { id: params.project.id },
            },
          });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    TicToToDo: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('TICKET_UPDATE', { tickUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    TicToDoing: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('TICKET_UPDATE', { tickUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    TicToDone: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('TICKET_UPDATE', { tickUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    CreateSprint: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('SPRINT_UPDATE', { spUpdate: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    RemoveProjectMember: async (object, params, ctx, resolveInfo) => {
      try {
        console.log('RemoveProjectMember');
        console.log(params);

        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('REMOVE_PRO_MEMBER', { removeProMem: result });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
  },
};

const schema = makeAugmentedSchema({
  typeDefs,
  resolvers,
  config: {
    auth: {
      isAuthenticated: true,
      hasRole: true,
      hasScope: true,
    },
    // debug: true,
  },
});

module.exports = schema;
