const { GraphQLJSON } = require('graphql-type-json');
const { PubSub, withFilter } = require('apollo-server-express');

const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const { makeAugmentedSchema, neo4jgraphql } = require('neo4j-graphql-js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const neode = require('./neode');
const authScopes = require('./authScopes');
const verifyToken = require('./authenticate');

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql')).toString('utf-8');

require('dotenv').config();

const pubSub = new PubSub();

const idListScalar = new GraphQLObjectType({
  name: 'ids',
  fields: () => ({
    ids: { type: new GraphQLList(GraphQLString) },
  }),
});
// name of the cookie that will be set as refresh token
const cookieName = 'catulam_token';

function createAccessToken(id, role) {
  //  token expiration, one hour from current time
  const exp = Math.floor(Date.now() / 1000) + (60 * 60);

  // get scopes based on user role
  const scope = authScopes[role]();
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
const resolveFunctions = {
  JSON: GraphQLJSON,
  idList: idListScalar,
  User: {
    fullName(obj) {
      return `${obj.firstName} ${obj.lastName}`;
    },
  },
  Token: {
    ttl(obj) {
      return obj.ttl / 1000;
    },
  },
  Query: {
    getCurrentUser: async (object, params, ctx, resolveInfo) => {
      if (!ctx.currentUser) {
        return null;
      }
      const { id } = ctx.currentUser;
      // update the params so, cypher query contains id.
      Object.assign(params, {
        id,
      });
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
  },
  Mutation: {
    refreshAccess: async (object, params, ctx, resolveInfo) => {
      // console.log('refreshAccess');
      try {
        // get refresh token from cookie
        const oldTokenString = ctx.req.cookies[cookieName];
        if (oldTokenString === undefined) {
          // return nothing (silent refresh) if no token was found
          return null;
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
      .catch((e) => {
        throw new Error(e);
      }),

    StartToSprint: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('project', { update: result.project.id });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    SprintToStart: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('project', { update: result.project.id });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    SwitchSprint: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('project', { update: result.project.id });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    UStoryTicketSwitch: async (_, {
      project, tick, uStoryRemove, sprintRemove, uStoryAdd, sprintAdd,
    }) => {
      try {
        let query = '';
        let params;
        switch (true) {
          case uStoryRemove !== undefined && uStoryAdd !== undefined
          && sprintRemove === undefined && sprintAdd === undefined:
            // UserStory Switch Only
            query = 'MATCH (a:Ticket { id:$tick.id })-[rel:SUB_TASK]->(b:UserStory{ id:$uStoryRemove.id })'
                            + ' MATCH (c:UserStory { id:$uStoryAdd.id })'
                            + ' CALL apoc.refactor.to(rel, c)'
                            + ' YIELD input, output, error'
                            + ' RETURN c';
            params = { tick, uStoryRemove, uStoryAdd };
            break;
          case uStoryRemove !== undefined && uStoryAdd !== undefined
          && sprintAdd !== undefined && sprintRemove === undefined:
            // Switch User Story and add sprint
            query = 'MATCH (t:Ticket { id:$tick.id })-[rel:SUB_TASK]->(b:UserStory{ id:$uStoryRemove.id })'
                            + ' MATCH (c:UserStory { id:$uStoryAdd.id })'
                            + ' CALL apoc.refactor.to(rel, c)'
                            + ' YIELD input, output, error'
                            + ' WITH t'
                            + ' MATCH (s:Sprint{id:$sprintAdd.id})'
                            + ' CREATE (t)-[rel1:SPRINT_TASK]->(s)';
            params = {
              tick, uStoryRemove, uStoryAdd, sprintAdd,
            };
            break;
          case uStoryRemove !== undefined && uStoryAdd !== undefined
          && sprintRemove !== undefined && sprintAdd === undefined:
            // Switch User Story and remove sprint
            query = 'MATCH (t:Ticket { id:$tick.id })-[rel:SUB_TASK]->(b:UserStory{ id:$uStoryRemove.id })'
                            + ' MATCH (c:UserStory { id:$uStoryAdd.id })'
                            + ' CALL apoc.refactor.to(rel, c)'
                            + ' YIELD input, output, error'
                            + ' WITH t'
                            + ' MATCH (t)-[rel1:SPRINT_TASK]->(s:Sprint{id:$sprintRemove.id})'
                            + ' DELETE rel1';
            params = {
              tick, uStoryRemove, uStoryAdd, sprintRemove,
            };
            break;
          case uStoryAdd !== undefined && sprintAdd !== undefined
          && uStoryRemove !== undefined && sprintRemove !== undefined:
            // change sprint and change user story
            query = 'MATCH (t:Ticket { id:$tick.id })-[rel:SUB_TASK]->(u1:UserStory{ id:$uStoryRemove.id })'
                            + ' MATCH (u2:UserStory { id:$uStoryAdd.id })'
                            + ' CALL apoc.refactor.to(rel,u2)'
                            + ' YIELD input, output, error'
                            + ' WITH t'
                            + ' MATCH (t)-[rel1:SPRINT_TASK]->(s1:Sprint{id:$sprintRemove.id})'
                            + ' MATCH (s2:Sprint { id:$sprintAdd.id })'
                            + ' CALL apoc.refactor.to(rel1, s2)'
                            + ' YIELD input, output, error'
                            + ' RETURN input, output, error';
            params = {
              tick, uStoryRemove, sprintRemove, uStoryAdd, sprintAdd,
            };
            break;
          default:
            throw Error('Query does not contain necessary params');
        }
        return neode.cypher(query, params)
          .then(() => {
            // trigger DOM update for all subscribers
            pubSub.publish('project', { update: project.id });
            return tick.id;
          })
          .catch((e) => {
            throw e;
          });
      } catch (e) {
        throw new Error(e);
      }
    },
    UnassignedTicketSwitch: async (_, {
      project, tick, uStoryRemove, sprintRemove, uStoryAdd, sprintAdd,
    }) => {
      try {
        let query = '';
        let params;
        switch (true) {
          case uStoryRemove !== undefined && sprintRemove === undefined
          && uStoryAdd === undefined && sprintAdd === undefined:
            // UserStory Remove Only
            query = 'MATCH (t:Ticket {id:$tick.id})-[rel:SUB_TASK]->(u:UserStory {id:$uStoryRemove.id}) DELETE rel ';
            params = { tick, uStoryRemove };
            break;
          case uStoryRemove !== undefined && sprintRemove === undefined
          && uStoryAdd === undefined && sprintAdd !== undefined:
            // UserStory Remove Only and add sprint
            query = 'MATCH (t:Ticket {id:$tick.id})-[rel:SUB_TASK]->(u:UserStory {id:$uStoryRemove.id})'
                            + ' DELETE rel'
                            + ' WITH t'
                            + ' MATCH (s:Sprint{id:$sprintAdd.id})'
                            + ' CREATE (t)-[rel1:SPRINT_TASK]->(s)';
            params = { tick, uStoryRemove, sprintAdd };
            break;
          case uStoryRemove !== undefined && sprintRemove !== undefined
          && uStoryAdd === undefined && sprintAdd === undefined:
            // REMOVE_USERSTORY_REMOVE_SPRINT
            query = 'MATCH (s:Sprint {id:$sprintRemove.id})<-[rel1:SPRINT_TASK]-(t:Ticket {id:$tick.id})-[rel2:SUB_TASK]->(u:UserStory {id:$uStoryRemove.id})'
                            + ' DELETE rel1, rel2 ';
            params = { tick, uStoryRemove, sprintRemove };
            break;
          case uStoryRemove !== undefined && sprintRemove !== undefined
          && uStoryAdd === undefined && sprintAdd !== undefined:
            // REMOVE_USERSTORY_CHANGE_SPRINT
            query = 'MATCH (s:Sprint {id:$sprintRemove.id})<-[rel1:SPRINT_TASK]-(t:Ticket {id:$tick.id})-[rel2:SUB_TASK]->(u:UserStory {id:$uStoryRemove.id})'
                            + ' DELETE rel1, rel2'
                            + ' WITH t'
                            + ' MATCH (s2:Sprint{id:$sprintAdd.id})'
                            + ' CREATE (t)-[rel1:SPRINT_TASK]->(s2)';
            params = {
              tick, uStoryRemove, sprintRemove, sprintAdd,
            };
            break;
          case uStoryRemove === undefined && sprintRemove === undefined
          && uStoryAdd !== undefined && sprintAdd === undefined:
            // ADD_NEW_USERSTORY only
            query = 'MATCH (t:Ticket),(u:UserStory)'
                            + ' WHERE t.id = $tick.id AND u.id = $uStoryAdd.id'
                            + ' CREATE (t)-[rel:SUB_TASK]->(u)';
            params = { tick, uStoryAdd };
            break;
          case uStoryRemove === undefined && sprintRemove !== undefined
          && uStoryAdd !== undefined && sprintAdd === undefined:
            // ADD_NEW_USERSTORY_CHANGE_SPRINT
            query = 'MATCH (t:Ticket),(u:UserStory)'
                            + ' WHERE t.id = $tick.id AND u.id = $uStoryAdd.id'
                            + ' CREATE (t)-[rel:SUB_TASK]->(u)'
                            + ' WITH t'
                            + ' MATCH (s:Sprint {id:$sprintRemove.id})<-[rel1:SPRINT_TASK]-(t)'
                            + ' DELETE rel1';
            params = { tick, uStoryAdd, sprintRemove };
            break;
          case uStoryRemove === undefined && sprintRemove !== undefined
          && uStoryAdd !== undefined && sprintAdd !== undefined:
            // ADD_NEW_USERSTORY_CHANGE_SPRINT
            query = 'MATCH (t:Ticket),(u:UserStory)'
                            + ' WHERE t.id = $tick.id AND u.id = $uStoryAdd.id'
                            + ' CREATE (t)-[rel:SUB_TASK]->(u)'
                            + ' WITH t'
                            + ' MATCH (s:Sprint {id:$sprintRemove.id})<-[rel1:SPRINT_TASK]-(t)'
                            + ' DELETE rel1'
                            + ' WITH t'
                            + ' MATCH (s2:Sprint{id:$sprintAdd.id})'
                            + ' CREATE (t)-[rel1:SPRINT_TASK]->(s2)';
            params = {
              tick, uStoryAdd, sprintRemove, sprintAdd,
            };
            break;
          case uStoryAdd !== undefined && sprintAdd !== undefined
          && uStoryRemove === undefined && sprintRemove === undefined:
            // ADD_NEW_USERSTORY_ADD_NEW_SPRINT
            query = 'MATCH (t:Ticket), (u:UserStory), (s:Sprint)'
                            + ' WHERE t.id = $tick.id AND u.id = $uStoryAdd.id AND s.id = $sprintAdd.id'
                            + ' CREATE (s)<-[rel1:SPRINT_TASK]-(t)-[rel2:SUB_TASK]->(u)';
            params = { tick, uStoryAdd, sprintAdd };
            break;
          default:
            throw Error('Query does not contain necessary params');
        }
        return neode.cypher(query, params)
          .then(() => {
            // trigger DOM update for all subscribers
            pubSub.publish('project', { update: project.id });
            return tick.id;
          })
          .catch((e) => {
            throw e;
          });
      } catch (e) {
        throw new Error(e);
      }
    },
    UpdateTicket: async (object, params, ctx, resolveInfo) => {
      // const alias = resolveInfo.fieldNodes[0].alias;
      const tickId = params.id;
      try {
        // query for the project id linked to the current ticket
        const proId = await neode.cypher('MATCH (a:Ticket { id:$tickId})-[rel:TICKET]->(b:Project)'
                    + ' RETURN b.id', { tickId })
          .then((result) => result.records[0].get('b.id'))
          .catch((e) => {
            throw e;
          });
        // using project Id found,
        pubSub.publish('project', { update: proId });
        return await neo4jgraphql(object, params, ctx, resolveInfo);
      } catch (e) {
        throw new Error(e);
      }
    },
    CreateUserStory: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('project', { update: result.project.id });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    UpdateTicketAssignee: async (_, {
      tick, remUser, addUser, project,
    }) => {
      if (remUser && !addUser) {
        try {
          return neode.cypher(
            'MATCH (t:Ticket { id: $tick.id })<-[rel:ASSIGNED_TASK]-(u:User { id: $remUser.id })'
                        + ' DELETE rel'
                        + ' RETURN u',
            { tick, remUser },
          )
            .then(() => {
              pubSub.publish('project', { update: project.id });
              return null;
            })
            .catch((e) => {
              throw e;
            });
        } catch (e) {
          throw new Error(e);
        }
      } else if (!remUser && addUser) {
        try {
          return neode.cypher('MATCH (t:Ticket),(u:User)'
                        + ' WHERE t.id = $tick.id AND u.id = $addUser.id'
                        + ' CREATE (u)-[rel:ASSIGNED_TASK]->(t)'
                        + ' RETURN u',
          { tick, addUser })
            .then((result) => {
              pubSub.publish('project', { update: project.id });
              return result.records[0].get('u').properties;
            })
            .catch((e) => {
              throw e;
            });
        } catch (e) {
          throw new Error(e);
        }
      } else if (remUser && addUser) {
        // reassign ticket
        try {
          return neode.cypher('MATCH (a:Ticket { id:$tick.id })<-[rel:ASSIGNED_TASK]-(b:User{ id:$remUser.id })'
                        + ' MATCH (c:User { id:$addUser.id })'
                        + ' CALL apoc.refactor.from(rel, c)'
                        + ' YIELD input, output, error'
                        + ' RETURN c',
          { tick, remUser, addUser })
            .then((result) => {
              pubSub.publish('project', { update: project.id });
              return result.records[0].get('c').properties;
            })
            .catch((e) => {
              throw e;
            });
        } catch (e) {
          throw new Error(e);
        }
      } else {
        throw new Error('Query does not contain necessary params');
      }
    },
    CreateTicket: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('project', { update: result.project.id });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    DeleteTicket: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('project', { update: result.project.id });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    TicToToDo: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('project', { update: result.project.id });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    TicToDoing: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('project', { update: result.project.id });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    UpdateUserStory: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('project', { update: result.project.id });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    DeleteUserStory: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('project', { update: result.project.id });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    TicToDone: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('project', { update: result.project.id });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    CreateSprint: async (object, params, ctx, resolveInfo) => {
      try {
        const result = await neo4jgraphql(object, params, ctx, resolveInfo);
        await pubSub.publish('project', { update: result.project.id });
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },
    CreateUser: async (object, params, ctx, resolveInfo) => {
      try {
        const salt = bcrypt.genSaltSync(Number(process.env.BCRYPTHASHCOST));
        // update params that will be inserted into db
        Object.assign(params, {
          // generate hash of pass to be saved in db
          password: bcrypt.hashSync(params.password, salt),
          // generate hash based on username, for gravatar art
          avatarHash: await md5(params.username),
        });
        return await neo4jgraphql(object, params, ctx, resolveInfo);
      } catch (e) {
        throw new Error(e);
      }
    },
  },
  Subscription: {
    update: {
      subscribe: withFilter(() => pubSub.asyncIterator('project'),
        (payload, variables) => payload.update === variables.proId),
    },
  },
};
const schema = makeAugmentedSchema({
  typeDefs,
  resolvers: resolveFunctions,
  config: {
    auth: {
      isAuthenticated: true,
      hasRole: true,
      hasScope: true,
    },
  },
});

module.exports = schema;
