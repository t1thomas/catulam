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

async function createToken(user, expiresIn) {
    const {username} = user;
    const token = jwt.sign({username}, process.env.JWTSECRET, {expiresIn});
    return await neode.cypher("MATCH (u:User { username: $username}) CREATE (u)-[rel:JWT]->(t: Token {id:$token}) RETURN t.id",
        {username:username, token: token})
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
        getCurrentUser: async (_, args, {currentUser}) =>{
            if(!currentUser) {
                return null;
            }
            return neode.cypher('MATCH (u:User {username: $username}) RETURN u', {username:currentUser.username})
                .then((result) => {
                    return result.records[0].get('u').properties;
                })
                .catch(e => {
                    throw new Error(e);
                });
        }
    },
    Mutation: {
        loginUser: (_, {username, password}) => {
            return neode.cypher('MATCH (u:User {username: $username}) RETURN u', {username})
                .then(async (result) => {
                    const user = result.records[0].get('u').properties;
                    const passValid = await bcrypt.compare(password, user.password);
                    if (passValid) {
                        const token = await createToken(user,'1hr');
                        return {id: token};
                    }
                    else {
                        // throw invalid password error
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
    },
};
const schema = makeAugmentedSchema({ typeDefs, resolvers: resolveFunctions });


module.exports = schema;
