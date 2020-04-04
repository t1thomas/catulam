const express = require('express');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const schema = require('./graphQL-schema');
const driver = require('./neo4jDriver');
const jwt = require('jsonwebtoken');
// set environment variables from ../.env

require('dotenv').config();

const port = process.env.GRAPHQL_LISTEN_PORT;
const app = express();



/*
 * An executable GraphQL schema object from GraphQL type definitions
 * including autogenerated queries and mutations.
 */

// verify JWT sent from client

async function verifyToken(token) {
    if(token){
        try {
            return await jwt.verify(token, process.env.JWTSECRET);
        }
        catch (e) {
            throw new AuthenticationError('Please sign in again');
        }
    }
}

const server = new ApolloServer({
    schema,
    context: async ({req}) => {
        const jwtToken = req.headers['authorization'];
        return {driver, currentUser: await verifyToken(jwtToken), jwtToken};
    },
    introspection: true,
    playground: true,
});

// async function bycrpyt() {
//     const passwordHash = await bcrypt.hash('test', 12);
//     console.log(passwordHash);
//
// }
server.applyMiddleware({ app });

app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));

