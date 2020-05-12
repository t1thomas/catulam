const { GraphQLJSON } = require('graphql-type-json');
const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const { makeAugmentedSchema, neo4jgraphql } = require('neo4j-graphql-js');
const { withFilter } = require('apollo-server-express');
const neode = require('./neode');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const neo4j = require('neo4j-driver');

const jwt = require('jsonwebtoken');
const md5 = require('md5');
const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql')).toString('utf-8');


const idListScalar = new GraphQLObjectType({
    name: 'ids',
    fields: () => ({
        ids: { type: new GraphQLList(GraphQLString) },
    }),
});

async function createUserToken(user, exp) {
    const {username, id, type} = user;
    const token = jwt.sign({exp, username, id, role: type}, process.env.JWT_SECRET);
    // add jwt token to db, with a 'time to live' configuration that deletes the token at exp time
    return await neode.cypher("MATCH (u:User { username: $username}) CREATE (u)-[rel:JWT]->(t: Token {token:$token}) WITH u, rel, t" +
        " CALL apoc.ttl.expire(t, $ttl, 's') RETURN t.token",
        {username, token, ttl: exp})
        .then((resultToken) => {
            return resultToken.records[0].get(0);
        })
        .catch(e => {
            throw new Error(e);
        });
}

const resolveFunctions = {
    JSON: GraphQLJSON,
    idList: idListScalar,
    User: {
        fullName(obj, params, ctx, resolveInfo) {
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
                .catch(e => {
                    throw new Error('Using redundant token, Sign in again ');
                });
        },
    },
    Mutation: {
        StartToSprint: async (object, params, ctx, resolveInfo) => {
            try {
                // using project Id found,
                ctx.pubSub.publish('project', {update: params.project.id});
                return await neo4jgraphql(object, params, ctx, resolveInfo, false);
            }catch (e) {
                throw new Error(e);
            }
        },
        SwitchSprint: async (object, params, ctx, resolveInfo) => {
            try {
                // using project Id found,
                ctx.pubSub.publish('project', {update: params.project.id});
                return await neo4jgraphql(object, params, ctx, resolveInfo, false);
            }catch (e) {
                throw new Error(e);
            }
        },
        SprintToStart: async (object, params, ctx, resolveInfo) => {
            try {
                // using project Id found,
                ctx.pubSub.publish('project', {update: params.project.id});
                return await neo4jgraphql(object, params, ctx, resolveInfo, false);
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
                        // console.log(project, tick, uStoryRemove, sprintRemove, uStoryAdd, sprintAdd);
                        console.log('here Mate');
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
                        // UserStory Remove Only
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
                return await neo4jgraphql(object, params, ctx, resolveInfo, false);
            }catch (e) {
                throw new Error(e);
            }
        },
        CreateUserStory:  async (object, params, ctx, resolveInfo) => {
            try {
                // using project Id found,
                ctx.pubSub.publish('project', {update: params.project.id});
                return await neo4jgraphql(object, params, ctx, resolveInfo, false);
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
                // using project Id found,
                ctx.pubSub.publish('project', {update: params.project.id});
                return await neo4jgraphql(object, params, ctx, resolveInfo, false);
            }catch (e) {
                throw new Error(e);
            }
        },
        CreateSprint: async (object, params, ctx, resolveInfo) => {
            try {
                // using project Id found,
                ctx.pubSub.publish('project', {update: params.project.id});
                return await neo4jgraphql(object, params, ctx, resolveInfo, false);
            }catch (e) {
                throw new Error(e);
            }
        },
        CreateUser: async (_, {id, firstName, lastName, username, email, password, passwordUpdate}) => {
            try {
                const salt = bcrypt.genSaltSync(Number(process.env.BCRYPTHASHCOST));
                const passHash = bcrypt.hashSync(password, salt);
                const avatarHash = await md5(username);
                return neode.cypher('CREATE (u:User{' +
                    ' id : $id,' +
                    ' firstName : $firstName,' +
                    ' lastName : $lastName,' +
                    ' username : $username,' +
                    ' email : $email,' +
                    ' password: $passHash,' +
                    ' passwordUpdate: $passwordUpdate,' +
                    ' avatar: $avatarHash' +
                    ' }) RETURN u',
                    {id, firstName, lastName, username, email, passHash, passwordUpdate, avatarHash})
                    .then((result) => {
                        return result.records[0].get('u').properties;
                    })
                    .catch(e => {
                        throw e;
                    });
            }catch (e) {
                throw new Error(e);
            }
        },
        loginUser: (_, {username, password}) => {
            return neode.cypher('MATCH (u:User {username: $username}) RETURN u', {username})
                .then(async (result) => {
                    const user = result.records[0].get('u').properties;
                    const passValid = await bcrypt.compare(password, user.password);
                    if (passValid) {
                        // if password reset is required give user a short lived token (5mins.)
                        if(user.passwordUpdate === true){
                            const exp = Math.floor(Date.now() / 1000) + (5 * 60);
                            const token = await createUserToken(user, exp);
                            return {token: token};
                        }
                        const exp = Math.floor(Date.now() / 1000) + (60 * 60);
                        const token = await createUserToken(user, exp);
                        return {token: token};
                    }
                    else {
                        throw 'pass';
                    }
                })
                .catch(e => {
                    if(e === 'pass'){
                        throw new Error('Password invalid');
                    }
                    throw new Error('Username invalid');
                });
        },
        resetPassword:(_, {username, newPassword}) => {
            return neode.cypher('MATCH (u:User {username: $username}) RETURN u', {username})
                .then(async (result) => {
                    const user = result.records[0].get('u').properties;
                    if(user.passwordUpdate === true){
                        try {
                            const salt = bcrypt.genSaltSync(Number(process.env.BCRYPTHASHCOST));
                            const hash = bcrypt.hashSync(newPassword, salt);
                            await neode.cypher('MATCH (u:User {username: $username}) SET u.password = $hash SET u.passwordUpdate = false RETURN u', {username, hash});

                            //  token expiration, one hour from current time
                            const exp = Math.floor(Date.now() / 1000) + (60 * 60);
                            const token = await createUserToken(user, exp);
                            return {token: token};
                        }catch (e) {
                            throw new Error(e);
                        }
                    }
                    else {
                        throw 'passReset';
                    }
                })
                .catch(e => {
                    console.log(e);
                    if(e === 'passReset'){
                        throw new Error('Invalid Reset attempt, contact admin');
                    }
                    throw new Error('Password reset Failed, try again later');
                });
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
            exclude: ["_AddUserTicketsPayload","_RemoveUserTicketsPayload","_MergeUserTicketsPayload"]
        }
    }
});

module.exports = schema;
