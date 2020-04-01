const { GraphQLJSON } = require('graphql-type-json');
const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const { makeAugmentedSchema } = require('neo4j-graphql-js');
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

function createToken(user, expiresIn) {
    const {username, email} = user;
    const token = jwt.sign({username, email}, process.env.JWTSECRET, {expiresIn});
    return token
}

const resolveFunctions = {
    JSON: GraphQLJSON,
    idList: idListScalar,
    Query:{
        getCurrentUser: async (_, args, {currentUser, neode}) =>{
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
        loginUser: (_, {username, password}, { neode }) => {
            return neode.cypher('MATCH (u:User {username: $username}) RETURN u', {username})
                .then(async (result) => {
                    const user = result.records[0].get('u').properties;
                    const passValid = await bcrypt.compare(password, user.password);
                    if (passValid) {
                        // console.log(user);
                        return {token: createToken(user,'1hr')};
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
                    throw new Error('Username invalid');
                });
        },
    },
};
const schema = makeAugmentedSchema({ typeDefs, resolvers: resolveFunctions });


module.exports = schema;
