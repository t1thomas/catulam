const { query, mutate } = require('./testingServer');

const gqlQueries = require('./gql-queries-mutations');

const jwt = require('jsonwebtoken');

async function verifyToken(token) {
    if(token){
        try {
            return await jwt.verify(token, process.env.JWTSECRET);
        }
        catch (e) {
            throw new Error('Please sign in again');
        }
    }
}
describe('Mutations', () => {
    it('Create a user', async () => {
        const res = await mutate({
            mutation: gqlQueries.CREATE_USER,
            variables: {
                id : "user1test",
                firstName : "Joe",
                lastName : "Bloggz",
                username : "user1",
                email : "test@gmail.com",
                password: "$2b$12$h6BlNYjDx8r2Uug3crDs8OhT6EME94TmBojovXCLsnbiun9EH6SbS" // hashed string 'test'
            },
        });
        expect(res.data.CreateUser).toMatchSnapshot();
    });

    it('Create 3 tickets', async () => {
        const res = await mutate({
            mutation: gqlQueries.CREATE_TICKETS,
        });
        expect(res.data).toMatchSnapshot();
    });

    it('Create 3 UserStories', async () => {
        const res = await mutate({
            mutation: gqlQueries.CREATE_USER_STORY,
        });
        expect(res.data).toMatchSnapshot();
    });

    it('Create 3 Sprints', async () => {
        const res = await mutate({
            mutation: gqlQueries.CREATE_SPRINTS,
        });
        expect(res.data).toMatchSnapshot();
    });

    it('Link 3 Tickets to UserStories', async () => {
        const res = await mutate({
            mutation: gqlQueries.ADD_USER_STORY_TICKETS,
        });
        expect(res.data).toMatchSnapshot();
    });
    it('Link 3 Tickets to Sprints', async () => {
        const res = await mutate({
            mutation: gqlQueries.ADD_SPRINT_TICKETS,
        });
        expect(res.data).toMatchSnapshot();
    });
    it('Login test user', async () => {
        const res = await mutate({
            mutation: gqlQueries.LOGIN_USER,
            variables: {username:"user1", password:"test"}
        });
        expect(await verifyToken(res.data.loginUser.token)).toEqual(expect.objectContaining({
                exp: expect.any(Number),
                username: 'user1',
                id: 'user1test',
                iat: expect.any(Number),
            })
        );
    });
});
