const { query, mutate } = require('./testingServer');

const gqlQueries = require('./gql-queries-mutations');

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
                password: "$2y$12$cIYpwlV1vWG01L.q6uAmb.Cf2Z/3tD7jlgZTP9HTjbGFQe7LyADkW" // hashed password : 'test'
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
});
