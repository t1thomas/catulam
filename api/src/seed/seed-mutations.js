const gql = require('graphql-tag');

module.exports = gql`
    mutation {
        u1: CreateUser(
            firstName: "Joe"
            lastName: "Bloggz"
            username: "user1"
            email: "test1@gmail.com"
            password: "test1"
            type: dev
        ) {
            id
        }
        u2: CreateUser(
            firstName: "Bob"
            lastName: "Martin"
            username: "user2"
            email: "test2@gmail.com"
            password: "test2"
            type: dev
        ) {
            id
        }
        u3: CreateUser(
            firstName: "Rich"
            lastName: "Jones"
            username: "pm"
            email: "test3@gmail.com"
            password: "test3"
            type: pm
        ) {
            id
        }
    }`;
