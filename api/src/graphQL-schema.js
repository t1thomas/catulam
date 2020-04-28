const { GraphQLJSON } = require('graphql-type-json');
const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const { makeAugmentedSchema } = require('neo4j-graphql-js');
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
    const {username, id} = user;
    const token = jwt.sign({exp, username, id, role: "user"}, process.env.JWT_SECRET);
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
    Query:{
        getCurrentUser: async (_, args, {currentUser, req}) =>{
            if(!currentUser) {
                return null;
            }
            const jwtToken = req.headers['authorization'];
            return neode.cypher('MATCH (u:User {username: $username})-[rel:JWT]->(t: Token {token:$token}) RETURN u',
                {username:currentUser.username, token: jwtToken})
                .then((result) => {
                    // set password field to empty string, to prevent mutation returning password value
                    // user.password = '';
                    // console.log(result.records[0].get('u').properties);

                    return result.records[0].get('u').properties;
                })
                .catch(e => {
                    throw new Error('Using redundant token, Sign in again ');
                });
        },
    },
    Mutation: {
        CreateTicket: async (_, { hourEstimate, title, desc, project, user }, {pubSub}) => {
            try {
                return neode.cypher('MATCH (p:Project),(u:User)'+
                    ' WHERE p.id = $proId AND u.id = $userId' +
                    ' CREATE (p)<-[:TICKET]-(t: Ticket {id:apoc.create.uuid(), title:$title, hourEstimate:$hourEst, desc:$description, done:false})<-[:CREATED {timestamp: apoc.date.currentTimestamp()}]-(u)'+
                    ' WITH p, t' +
                    ' MATCH (p)<-[r1:TICKET]-(:Ticket)' +
                    ' WITH COUNT(r1) AS issNo, t' +
                    ' SET t.issueNumber = issNo' +
                    ' RETURN t',
                    {
                        ...(hourEstimate ? {hourEst: neo4j.int(hourEstimate)} : {hourEst: neo4j.int(0)}),
                        title, ...(desc ? {description:desc} : {description:''}),
                        proId: project.id, userId: user.id
                    })
                    .then((result) => {
                        pubSub.publish('project', {update: project.id});
                        return result.records[0].get('t').properties;
                    })
                    .catch(e => {
                        throw e;
                    });
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
                    // if(e === 'cypher'){
                    //     throw new Error('INTERNAL_ERROR: DATABASE STORAGE FAILED')
                    // }
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
            // subscribe: (_,__,{pubSub}) => pubSub.asyncIterator('project')
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
        }
    }
});

module.exports = schema;
