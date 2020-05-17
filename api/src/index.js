const express = require('express');
const { ApolloServer, AuthenticationError, PubSub } = require('apollo-server-express');
const schema = require('./graphQL-schema');
const driver = require('./neo4jDriver');
const http = require('http');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
// set environment variables from ../.env

require('dotenv').config();

const PORT = process.env.GRAPHQL_LISTEN_PORT;
const app = express();
app.use(bodyParser.json());



// verify JWT sent from client

async function verifyToken(token) {
    if(token){
        try {
            return await jwt.verify(token, process.env.JWT_SECRET);
        }
        catch (e) {
            throw new AuthenticationError('Please sign in again');
        }
    }
}
const pubSub = new PubSub();

const server = new ApolloServer({
    schema,
    // context: async ({req}) => {
    //     return {driver, req, pubSub};
    // },
    context: async ({req, connection}) => {
        if (connection) {
            return { ...connection.context, pubSub};
        } else {
            return {driver, currentUser: await verifyToken(req.headers['authorization']), req, pubSub};
        }
    },
    subscriptions: {
        onConnect: async(connectionParams) => {
            console.log(connectionParams.authToken);
            if (connectionParams.authToken) {
                return {currentUser: await verifyToken(connectionParams.authToken)};
            }
            throw new Error('Missing auth token!');
        },
    },
    introspection: true,
    playground: true,
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
