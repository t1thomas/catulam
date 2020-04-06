const { ApolloServer } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');
const driver = require('./testDb/testDbNeo4jDriver');
const gqlQueries = require('./gql-queries-mutations');
const jwt = require('jsonwebtoken');

// schema used for testing is same as production
const schema = require('../src/graphQL-schema');

let jwtToken = '';


// Create a test server - using similar server setup as '../src/index.js'
const server = new ApolloServer({
    context: async () => {
        return {driver, currentUser: await verifyToken(jwtToken), jwtToken};
    },
    schema,
});
// pass server to testing client

async function verifyToken(token) {
    if(token){
        try {
            return await jwt.verify(token, process.env.JWTSECRET);
        }
        catch (e) {
            return null;
        }
    }
}
const testUser = {
    id : "user1test",
    firstName : "Joe",
    lastName : "Bloggz",
    username : "user1",
    email : "test@gmail.com",
    password: "$2b$12$h6BlNYjDx8r2Uug3crDs8OhT6EME94TmBojovXCLsnbiun9EH6SbS" // hashed string 'test'
};

describe('User Login Mutations', () => {
    it('Create a user', async () => {
        const { mutate } = createTestClient(server);

        const res = await mutate({
            mutation: gqlQueries.CREATE_USER,
            variables: Object.assign({}, testUser),
        });
        expect(res.data.CreateUser).toMatchObject(testUser);
    });

    it('Login user invalid error ', async () => {
        const { mutate } = createTestClient(server);

        const res = await mutate({
            mutation: gqlQueries.LOGIN_USER,
            variables: {username:"invalidUser", password:"invalid"}
        });
        expect(res.errors[0].message).toBe("Username invalid");
    });

    it('Login password invalid error ', async () => {
        const { mutate } = createTestClient(server);

        const res = await mutate({
            mutation: gqlQueries.LOGIN_USER,
            variables: {username: testUser.username, password:"invalid"}
        });
        expect(res.errors[0].message).toBe("Password invalid");
    });

    it('Login test user', async () => {
        const { mutate } = createTestClient(server);

        const res = await mutate({
            mutation: gqlQueries.LOGIN_USER,
            variables: {username: testUser.username, password: "test"}
        });
        jwtToken = res.data.loginUser.token;
        // verifyToken only returns decrypted token payload, if the token can be verified successfully
        expect(await verifyToken(jwtToken)).toEqual(expect.objectContaining({
                exp: expect.any(Number), // expiry set by JWT token is in format NUMBER
                username: testUser.username,
                id: testUser.id,
                iat: expect.any(Number), // ISSUED AT TIME  set by JWT token is in format NUMBER
            })
        );
    });

    it('Get test user', async () => {
        const { mutate } = createTestClient(server);

        /* set password key in comparison object to '', as
        CURRENT_USER mutation returns empty string for password field
         */
        const testUserCopy = Object.assign({}, testUser);
        testUserCopy.password = '';


        const res = await mutate({
            mutation: gqlQueries.CURRENT_USER,
        });

        expect(res.data.getCurrentUser).toMatchObject(testUserCopy);

    });

    it('Logout User (Delete token from db)', async () => {
        const { mutate } = createTestClient(server);

        /* set password key in comparison object to '', as
        CURRENT_USER mutation returns empty string for password field
         */
        const res = await mutate({
            mutation: gqlQueries.DELETE_TOKEN,
            variables: {token: jwtToken}
        });
        expect(res.data.DeleteToken).toMatchObject({token: jwtToken});

    });

});
