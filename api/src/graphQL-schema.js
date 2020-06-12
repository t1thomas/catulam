const { GraphQLJSON } = require('graphql-type-json');
const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const { makeAugmentedSchema, neo4jgraphql } = require('neo4j-graphql-js');
const { withFilter } = require('apollo-server-express');
const neode = require('./neode');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql')).toString('utf-8');

require('dotenv').config();

const idListScalar = new GraphQLObjectType({
    name: 'ids',
    fields: () => ({
        ids: { type: new GraphQLList(GraphQLString) },
    }),
});

async function validatePass(username, password) {
    return neode.cypher('MATCH (u:User {username: $username}) RETURN u', {username})
        .then(async (result) => {
            const user = result.records[0].get('u').properties;
            return await bcrypt.compare(password, user.password);
        }).catch(e => {
            throw new Error(e);
        });
}
async function createUserToken(username, resetPass) {
    return neode.cypher('MATCH (u:User {username: $username}) RETURN u', {username})
        .then(async (result) => {
            const user = result.records[0].get('u').properties;
            const {username, id, type} = user;
            let exp;
            if (user.passwordUpdate === true) {
                if (resetPass) {
                    //  token expiration, one hour from current time
                    exp = Math.floor(Date.now() / 1000) + (60 * 60);
                } else {
                    //  token expiration, 5min from current time
                    exp = Math.floor(Date.now() / 1000) + (5 * 60);
                }
            } else {
                exp = Math.floor(Date.now() / 1000) + (60 * 60);
            }
            return { token: jwt.sign({exp, username, id, role: type}, process.env.JWT_SECRET), exp };
        }).catch(e => {
            throw new Error(e);
        });
}
const resolveFunctions = {
    JSON: GraphQLJSON,
    idList: idListScalar,
    User: {
        fullName(obj) {
            return `${obj.firstName} ${obj.lastName}`;
        }
    },
    Query:{
        getCurrentUser: async (_, args, {currentUser, req}) =>{
            if(!currentUser) {
                return null;
            }
            const jwtToken = req.headers['authorization'];
            return neode.cypher('MATCH (u:User {username: $username})-[rel:JWT]->(t: Token {token:$token}) RETURN u',
                {username:currentUser.username, token: jwtToken})
                .then((result) => {
                    return result.records[0].get('u').properties;
                })
                .catch(() => {
                    throw new Error('Using redundant token, Sign in again ');
                });
        },
    },
    Mutation: {
        StartToSprint: async (object, params, ctx, resolveInfo) => {
            try {
                const result = await neo4jgraphql(object, params, ctx, resolveInfo);
                await ctx.pubSub.publish('project', {update: result.project.id});
                return result;
            }catch (e) {
                throw new Error(e);
            }
        },
        SprintToStart: async (object, params, ctx, resolveInfo) => {
            try {
                const result = await neo4jgraphql(object, params, ctx, resolveInfo);
                await ctx.pubSub.publish('project', {update: result.project.id});
                return result;
            }catch (e) {
                throw new Error(e);
            }
        },
        SwitchSprint: async (object, params, ctx, resolveInfo) => {
            try {
                const result = await neo4jgraphql(object, params, ctx, resolveInfo);
                await ctx.pubSub.publish('project', {update: result.project.id});
                return result;
            }catch (e) {
                throw new Error(e);
            }
        },
        UStoryTicketSwitch: async (_, { project, tick, uStoryRemove, sprintRemove, uStoryAdd, sprintAdd }, {pubSub}) => {
            try {
                let query = '';
                let params = undefined;
                switch (true) {
                case uStoryRemove !== undefined && uStoryAdd !== undefined && sprintRemove === undefined && sprintAdd === undefined:
                    // UserStory Switch Only
                    query = 'MATCH (a:Ticket { id:$tick.id })-[rel:SUB_TASK]->(b:UserStory{ id:$uStoryRemove.id })' +
                            ' MATCH (c:UserStory { id:$uStoryAdd.id })'+
                            ' CALL apoc.refactor.to(rel, c)'+
                            ' YIELD input, output, error' +
                            ' RETURN c';
                    params = { tick, uStoryRemove, uStoryAdd };
                    break;
                case uStoryRemove !== undefined && uStoryAdd !== undefined && sprintAdd !== undefined && sprintRemove === undefined:
                    // Switch User Story and add sprint
                    query = 'MATCH (t:Ticket { id:$tick.id })-[rel:SUB_TASK]->(b:UserStory{ id:$uStoryRemove.id })' +
                            ' MATCH (c:UserStory { id:$uStoryAdd.id })' +
                            ' CALL apoc.refactor.to(rel, c)' +
                            ' YIELD input, output, error' +
                            ' WITH t' +
                            ' MATCH (s:Sprint{id:$sprintAdd.id})' +
                            ' CREATE (t)-[rel1:SPRINT_TASK]->(s)';
                    params = {tick, uStoryRemove, uStoryAdd, sprintAdd};
                    break;
                case uStoryRemove !== undefined && uStoryAdd !== undefined && sprintRemove !== undefined && sprintAdd === undefined:
                    // Switch User Story and remove sprint
                    query = 'MATCH (t:Ticket { id:$tick.id })-[rel:SUB_TASK]->(b:UserStory{ id:$uStoryRemove.id })' +
                            ' MATCH (c:UserStory { id:$uStoryAdd.id })' +
                            ' CALL apoc.refactor.to(rel, c)' +
                            ' YIELD input, output, error' +
                            ' WITH t' +
                            ' MATCH (t)-[rel1:SPRINT_TASK]->(s:Sprint{id:$sprintRemove.id})' +
                            ' DELETE rel1';
                    params = {tick, uStoryRemove, uStoryAdd, sprintRemove};
                    break;
                case uStoryAdd !== undefined && sprintAdd !== undefined && uStoryRemove !== undefined && sprintRemove !== undefined:
                    // change sprint and change user story
                    query = 'MATCH (t:Ticket { id:$tick.id })-[rel:SUB_TASK]->(u1:UserStory{ id:$uStoryRemove.id })' +
                            ' MATCH (u2:UserStory { id:$uStoryAdd.id })' +
                            ' CALL apoc.refactor.to(rel,u2)' +
                            ' YIELD input, output, error' +
                            ' WITH t' +
                            ' MATCH (t)-[rel1:SPRINT_TASK]->(s1:Sprint{id:$sprintRemove.id})' +
                            ' MATCH (s2:Sprint { id:$sprintAdd.id })' +
                            ' CALL apoc.refactor.to(rel1, s2)' +
                            ' YIELD input, output, error' +
                            ' RETURN input, output, error';
                    params = {tick, uStoryRemove, sprintRemove, uStoryAdd, sprintAdd};
                    break;
                default:
                    throw 'Query does not contain necessary params';
                }
                return neode.cypher(query,params)
                    .then(() => {
                        // trigger DOM update for all subscribers
                        pubSub.publish('project', {update: project.id});
                        return tick.id;
                    })
                    .catch(e => {
                        throw e;
                    });
            }catch (e) {
                throw new Error(e);
            }
        },
        UnassignedTicketSwitch: async (_, { project, tick, uStoryRemove, sprintRemove, uStoryAdd, sprintAdd }, {pubSub}) => {
            try {
                let query = '';
                let params = undefined;
                switch (true) {
                case uStoryRemove !== undefined && sprintRemove === undefined && uStoryAdd === undefined && sprintAdd === undefined:
                    // UserStory Remove Only
                    query = 'MATCH (t:Ticket {id:$tick.id})-[rel:SUB_TASK]->(u:UserStory {id:$uStoryRemove.id}) DELETE rel ';
                    params = { tick, uStoryRemove };
                    break;
                case uStoryRemove !== undefined && sprintRemove === undefined && uStoryAdd === undefined && sprintAdd !== undefined:
                    // UserStory Remove Only and add sprint
                    query = 'MATCH (t:Ticket {id:$tick.id})-[rel:SUB_TASK]->(u:UserStory {id:$uStoryRemove.id})'+
                            ' DELETE rel' +
                            ' WITH t' +
                            ' MATCH (s:Sprint{id:$sprintAdd.id})' +
                            ' CREATE (t)-[rel1:SPRINT_TASK]->(s)';
                    params = { tick, uStoryRemove, sprintAdd };
                    break;
                case uStoryRemove !== undefined && sprintRemove !== undefined && uStoryAdd === undefined && sprintAdd === undefined:
                    // REMOVE_USERSTORY_REMOVE_SPRINT
                    query = 'MATCH (s:Sprint {id:$sprintRemove.id})<-[rel1:SPRINT_TASK]-(t:Ticket {id:$tick.id})-[rel2:SUB_TASK]->(u:UserStory {id:$uStoryRemove.id})' +
                            ' DELETE rel1, rel2 ';
                    params = {tick, uStoryRemove, sprintRemove};
                    break;
                case uStoryRemove !== undefined && sprintRemove !== undefined && uStoryAdd === undefined && sprintAdd !== undefined:
                    // REMOVE_USERSTORY_CHANGE_SPRINT
                    query = 'MATCH (s:Sprint {id:$sprintRemove.id})<-[rel1:SPRINT_TASK]-(t:Ticket {id:$tick.id})-[rel2:SUB_TASK]->(u:UserStory {id:$uStoryRemove.id})' +
                            ' DELETE rel1, rel2' +
                            ' WITH t' +
                            ' MATCH (s2:Sprint{id:$sprintAdd.id})' +
                            ' CREATE (t)-[rel1:SPRINT_TASK]->(s2)';
                    params = {tick, uStoryRemove, sprintRemove, sprintAdd};
                    break;
                case uStoryRemove === undefined && sprintRemove === undefined && uStoryAdd !== undefined && sprintAdd === undefined:
                    // ADD_NEW_USERSTORY only
                    query = 'MATCH (t:Ticket),(u:UserStory)' +
                            ' WHERE t.id = $tick.id AND u.id = $uStoryAdd.id' +
                            ' CREATE (t)-[rel:SUB_TASK]->(u)';
                    params = { tick, uStoryAdd };
                    break;
                case uStoryRemove === undefined && sprintRemove !== undefined && uStoryAdd !== undefined && sprintAdd === undefined:
                    // ADD_NEW_USERSTORY_CHANGE_SPRINT
                    query = 'MATCH (t:Ticket),(u:UserStory)' +
                            ' WHERE t.id = $tick.id AND u.id = $uStoryAdd.id' +
                            ' CREATE (t)-[rel:SUB_TASK]->(u)' +
                            ' WITH t' +
                            ' MATCH (s:Sprint {id:$sprintRemove.id})<-[rel1:SPRINT_TASK]-(t)' +
                            ' DELETE rel1';
                    params = { tick, uStoryAdd, sprintRemove };
                    break;
                case uStoryRemove === undefined && sprintRemove !== undefined && uStoryAdd !== undefined && sprintAdd !== undefined:
                    // ADD_NEW_USERSTORY_CHANGE_SPRINT
                    query = 'MATCH (t:Ticket),(u:UserStory)' +
                            ' WHERE t.id = $tick.id AND u.id = $uStoryAdd.id' +
                            ' CREATE (t)-[rel:SUB_TASK]->(u)' +
                            ' WITH t' +
                            ' MATCH (s:Sprint {id:$sprintRemove.id})<-[rel1:SPRINT_TASK]-(t)' +
                            ' DELETE rel1' +
                            ' WITH t' +
                            ' MATCH (s2:Sprint{id:$sprintAdd.id})' +
                            ' CREATE (t)-[rel1:SPRINT_TASK]->(s2)';
                    params = { tick, uStoryAdd, sprintRemove, sprintAdd };
                    break;
                case uStoryAdd !== undefined && sprintAdd !== undefined && uStoryRemove === undefined && sprintRemove === undefined:
                    // ADD_NEW_USERSTORY_ADD_NEW_SPRINT
                    query = 'MATCH (t:Ticket), (u:UserStory), (s:Sprint)' +
                            ' WHERE t.id = $tick.id AND u.id = $uStoryAdd.id AND s.id = $sprintAdd.id' +
                            ' CREATE (s)<-[rel1:SPRINT_TASK]-(t)-[rel2:SUB_TASK]->(u)';
                    params = {tick, uStoryAdd, sprintAdd};
                    break;
                default:
                    throw 'Query does not contain necessary params';
                }
                return neode.cypher(query,params)
                    .then(() => {
                        // trigger DOM update for all subscribers
                        pubSub.publish('project', {update: project.id});
                        return tick.id;
                    })
                    .catch(e => {
                        throw e;
                    });
            }catch (e) {
                throw new Error(e);
            }
        },
        UpdateTicket:  async (object, params, ctx, resolveInfo) => {
            // const alias = resolveInfo.fieldNodes[0].alias;
            const tickId = params.id;
            try {
                // query for the project id linked to the current ticket
                const proId = await neode.cypher('MATCH (a:Ticket { id:$tickId})-[rel:TICKET]->(b:Project)' +
                    ' RETURN b.id',{tickId})
                    .then((result) => {
                        return result.records[0].get('b.id');
                    })
                    .catch(e => {
                        throw e;
                    });
                // using project Id found,
                ctx.pubSub.publish('project', {update: proId});
                return await neo4jgraphql(object, params, ctx, resolveInfo);
            }catch (e) {
                throw new Error(e);
            }
        },
        CreateUserStory:  async (object, params, ctx, resolveInfo) => {
            try {
                const result = await neo4jgraphql(object, params, ctx, resolveInfo);
                await ctx.pubSub.publish('project', {update: result.project.id});
                return result;
            }catch (e) {
                throw new Error(e);
            }
        },
        UpdateTicketAssignee: async (_, { tick, remUser, addUser, project }, {pubSub}) => {
            if(remUser && !addUser){
                try {
                    return neode.cypher(
                        'MATCH (t:Ticket { id: $tick.id })<-[rel:ASSIGNED_TASK]-(u:User { id: $remUser.id })' +
                        ' DELETE rel' +
                        ' RETURN u',
                        {tick, remUser})
                        .then(() => {
                            pubSub.publish('project', {update: project.id});
                            return null;
                        })
                        .catch(e => {
                            throw e;
                        });
                }catch (e) {
                    throw new Error(e);
                }
            }else if(!remUser && addUser) {
                try {
                    return neode.cypher('MATCH (t:Ticket),(u:User)' +
                        ' WHERE t.id = $tick.id AND u.id = $addUser.id' +
                        ' CREATE (u)-[rel:ASSIGNED_TASK]->(t)' +
                        ' RETURN u',
                    {tick, addUser})
                        .then((result) => {
                            pubSub.publish('project', {update: project.id});
                            return result.records[0].get('u').properties;
                        })
                        .catch(e => {
                            throw e;
                        });
                }catch (e) {
                    throw new Error(e);
                }
            }else if(remUser && addUser){
                // reassign ticket
                try {
                    return neode.cypher('MATCH (a:Ticket { id:$tick.id })<-[rel:ASSIGNED_TASK]-(b:User{ id:$remUser.id })' +
                        ' MATCH (c:User { id:$addUser.id })' +
                        ' CALL apoc.refactor.from(rel, c)' +
                        ' YIELD input, output, error' +
                        ' RETURN c',
                    {tick, remUser, addUser })
                        .then((result) => {
                            pubSub.publish('project', {update: project.id});
                            return result.records[0].get('c').properties;
                        })
                        .catch(e => {
                            throw e;
                        });
                }catch (e) {
                    throw new Error(e);
                }
            }else {
                throw new Error('Query does not contain necessary params');
            }
        },
        CreateTicket:  async (object, params, ctx, resolveInfo) => {
            try {
                const result = await neo4jgraphql(object, params, ctx, resolveInfo);
                await ctx.pubSub.publish('project', {update: result.project.id});
                return result;
            }catch (e) {
                throw new Error(e);
            }
        },
        TicToToDo:  async (object, params, ctx, resolveInfo) => {
            try {
                const result = await neo4jgraphql(object, params, ctx, resolveInfo);
                await ctx.pubSub.publish('project', {update: result.project.id});
                return result;
            }catch (e) {
                throw new Error(e);
            }
        },
        TicToDoing:  async (object, params, ctx, resolveInfo) => {
            try {
                const result = await neo4jgraphql(object, params, ctx, resolveInfo);
                await ctx.pubSub.publish('project', {update: result.project.id});
                return result;
            }catch (e) {
                throw new Error(e);
            }
        },
        UpdateUserStory:  async (object, params, ctx, resolveInfo) => {
            try {
                const result = await neo4jgraphql(object, params, ctx, resolveInfo);
                await ctx.pubSub.publish('project', {update: result.project.id});
                return result;
            }catch (e) {
                throw new Error(e);
            }
        },
        DeleteUserStory:  async (object, params, ctx, resolveInfo) => {
            try {
                const result = await neo4jgraphql(object, params, ctx, resolveInfo);
                await ctx.pubSub.publish('project', {update: result.project.id});
                return result;
            }catch (e) {
                throw new Error(e);
            }
        },
        TicToDone:  async (object, params, ctx, resolveInfo) => {
            try {
                const result = await neo4jgraphql(object, params, ctx, resolveInfo);
                await ctx.pubSub.publish('project', {update: result.project.id});
                return result;
            }catch (e) {
                throw new Error(e);
            }
        },
        CreateSprint: async (object, params, ctx, resolveInfo) => {
            try {
                const result = await neo4jgraphql(object, params, ctx, resolveInfo);
                await ctx.pubSub.publish('project', {update: result.project.id});
                return result;
            }catch (e) {
                throw new Error(e);
            }
        },
        CreateUser: async (object, params, ctx, resolveInfo) => {
            try {
                const salt = bcrypt.genSaltSync(Number(process.env.BCRYPTHASHCOST));
                // update params that will be inserted into db
                Object.assign(params, {
                    password: bcrypt.hashSync(params.password, salt),
                    avatarHash: await md5(params.username)
                });
                return await neo4jgraphql(object, params, ctx, resolveInfo);
            }catch (e) {
                throw new Error(e);
            }
        },
        loginUser: async (object, params, ctx, resolveInfo) => {
            try {
                const passValid = await validatePass(params.username, params.password);
                    if (passValid) {
                        const { token, exp } = await createUserToken(params.username, false);
                        // update params that will be inserted into db
                        Object.assign(params, {
                            token,
                            exp
                        });
                        return await neo4jgraphql(object, params, ctx, resolveInfo);
                    }
                    else {
                        throw 'pass';
                    }
                // jwt token added to db, with a 'time to live' configuration that deletes the token at exp time
            } catch (e) {
                if(e === 'pass'){
                 throw new Error('Username/Password invalid');
                }
                throw new Error(`Unable to Login: ${e}`);
            }
        },
        resetPassword: async (object, params, ctx, resolveInfo) => {
            try {
                const salt = bcrypt.genSaltSync(Number(process.env.BCRYPTHASHCOST));
                const hash = bcrypt.hashSync(params.newPassword, salt);
                const { token, exp } = await createUserToken(params.username, true);
                Object.assign(params, {
                    token,
                    exp,
                    newPassword: hash
                });
                // jwt token added to db, with a 'time to live' configuration that deletes the token at exp time
                return await neo4jgraphql(object, params, ctx, resolveInfo);
            } catch (e) {
                throw new Error(`Invalid Reset attempt, contact admin: ${e}`);
            }
        }
    },
    Subscription: {
        update: {
            subscribe:
                withFilter(
                    (_,__,{pubSub}) => pubSub.asyncIterator('project'),
                    (payload, variables) => {
                        return payload.update === variables.proId;
                    }
                )
        }
    },
};
const schema = makeAugmentedSchema({
    typeDefs,
    resolvers: resolveFunctions,
    config: {
        auth: {
            isAuthenticated: true,
            hasRole: true
        },
        mutation: {
            exclude: ['_AddUserTicketsPayload','_RemoveUserTicketsPayload','_MergeUserTicketsPayload']
        }
    }
});

module.exports = schema;
