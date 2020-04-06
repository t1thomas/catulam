const { GraphQLJSON } = require('graphql-type-json');
const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const { makeAugmentedSchema } = require('neo4j-graphql-js');
const neode = require('./neode');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql')).toString('utf-8');


const idListScalar = new GraphQLObjectType({
    name: 'ids',
    fields: () => ({
        ids: { type: new GraphQLList(GraphQLString) },
    }),
});

async function createToken(user, exp) {
    const {username, id} = user;
    const token = jwt.sign({exp, username, id}, process.env.JWTSECRET);
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
        getCurrentUser: async (_, args, {currentUser, jwtToken}) =>{
            if(!currentUser) {
                throw new Error('Verification Error');
            }
            console.log(currentUser);
            return neode.cypher('MATCH (u:User {username: $username})-[rel:JWT]->(t: Token {token:$token}) RETURN u',
                {username:currentUser.username, token: jwtToken})
                .then((result) => {
                    return result.records[0].get('u').properties;
                })
                .catch(e => {
                    console.log(e);
                    throw new Error('Using redundant token, Sign in again ');
                });
        },
    },
    Mutation: {
        loginUser: (_, {username, password}) => {
            return neode.cypher('MATCH (u:User {username: $username}) RETURN u', {username})
                .then(async (result) => {
                    const user = result.records[0].get('u').properties;
                    console.log(password);
                    console.log(user.password);
                    const passValid = await bcrypt.compare(password, user.password);
                    if (passValid) {
                        //  token expiration, one hour from current time
                        const exp = Math.floor(Date.now() / 1000) + (60 * 60);
                        const token = await createToken(user, exp);
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
                    console.log(e);
                    // if(e === 'cypher'){
                    //     throw new Error('INTERNAL_ERROR: DATABASE STORAGE FAILED')
                    // }
                    throw new Error('Username invalid');
                });
        },
    },
};
const schema = makeAugmentedSchema({ typeDefs, resolvers: resolveFunctions });


module.exports = schema;
