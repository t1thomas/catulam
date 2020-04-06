const { ApolloServer } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');
const driver = require('./testDb/testDbNeo4jDriver');
const gqlQueries = require('./gql-queries-mutations');
const jwt = require('jsonwebtoken');

// schema used for testing is same as production
const schema = require('../src/graphQL-schema');
// Create a test server
const server = new ApolloServer({
    context: { driver },
    schema,
});
// pass server to testing client
const { mutate } = createTestClient(server);




describe('Mutations', () => {

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
