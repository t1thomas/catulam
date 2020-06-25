const gql = require('graphql-tag');
// three test users created with one mutation
module.exports = gql`
    mutation {
        u1: CreateUser(
            firstName: "Joe"
            lastName: "Bloggz"
            username: "user1"
            email: "test1@gmail.com"
            password: "test1"
            role: dev
        ) {
            id
        }
        u2: CreateUser(
            firstName: "Bob"
            lastName: "Martin"
            username: "user2"
            email: "test2@gmail.com"
            password: "test2"
            role: dev
        ) {
            id
        }
        u3: CreateUser(
            firstName: "Rich"
            lastName: "Jones"
            username: "pm"
            email: "test3@gmail.com"
            password: "test3"
            role: pm
        ) {
            id
        }
    }`;
