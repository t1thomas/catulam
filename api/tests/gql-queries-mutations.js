const gql = require('graphql-tag');

const gqlQueries = {
    DELETE_TOKEN: gql`mutation($token: String!) {
        DeleteToken(token: $token){
            token
        }
    }
    `,
    CURRENT_USER: gql`query {
        getCurrentUser {
            id
            firstName
            lastName
            username
            email
            password
            passwordUpdate
        }
    }`,
    CREATE_USER: gql`
        mutation(
            $id: ID
            $firstName: String!
            $lastName: String
            $username: String!
            $email: String!
            $password: String!
            $passwordUpdate: Boolean!
        ) {
            CreateUser(
                id: $id
                firstName: $firstName
                lastName: $lastName
                username: $username
                email: $email
                password: $password
                passwordUpdate: $passwordUpdate
            ){
                id
                firstName
                lastName
                username
                email
                password
                passwordUpdate
            }
        }`,
    CREATE_TICKETS: gql`
        mutation {
            tick1: CreateTicket(
                id: "t1test"
                title: "Set Up API"
                hourEstimate: 5
                done: false
                issueNumber: 1
                desc: "Create API for backend and frontend"
            ) {
                id
                title
                hourEstimate
                done
                issueNumber
                desc
            }
            tick2: CreateTicket(
                id: "t2test"
                title: "login page"
                hourEstimate: 5
                done: false
                issueNumber: 2
                desc: "Create Login Page for users to enter credentials"
            ) {
                id
                title
                hourEstimate
                done
                issueNumber
                desc
            }
            tick3: CreateTicket(
                id: "t3test"
                title: "Landing page"
                hourEstimate: 5
                done: false
                issueNumber: 3
                desc: "Create landing page for client side SPA"
            ) {
                id
                title
                hourEstimate
                done
                issueNumber
                desc
            }
        }`,
    CREATE_USER_STORY: gql`
        mutation {
            uStory1: CreateUserStory(storyText: "Example User Story 1", id: "us1test") {
                storyText
                id
            }
            uStory2: CreateUserStory(storyText: "Example User Story 2", id: "us2test") {
                storyText
                id
            }
            uStory3: CreateUserStory(storyText: "Example User Story 3", id: "us3test") {
                storyText
                id
            }
        }`,
    CREATE_SPRINTS: gql`
        mutation {
            sprint1: CreateSprint(id: "sp1test", sprintNo: 1) {
                sprintNo
                id
            }
            sprint2: CreateSprint(id: "sp2test", sprintNo: 2) {
                sprintNo
                id
            }
            sprint3: CreateSprint(id: "sp3test", sprintNo: 3) {
                sprintNo
                id
            }
        }`,
    ADD_USER_STORY_TICKETS: gql`
        mutation {
            UStoryTic1: AddUserStoryTickets(
                from: { id: "t1test" }
                to: { id: "us1test" }
            ) {
                from {
                    id
                }
                to {
                    id
                }
            }
            UStoryTic2: AddUserStoryTickets(
                from: { id: "t2test" }
                to: { id: "us2test" }
            ) {
                from {
                    id
                }
                to {
                    id
                }
            }
            UStoryTic3: AddUserStoryTickets(
                from: { id: "t3test" }
                to: { id: "us3test" }
            ) {
                from {
                    id
                }
                to {
                    id
                }
            }
        }`,
    ADD_SPRINT_TICKETS:gql`
        mutation {
            SprintTic1: AddSprintTickets(
                from: { id: "t1test" }
                to: { id: "sp1test" }
            ) {
                from {
                    id
                }
                to {
                    id
                }
            }
            SprintTic2: AddSprintTickets(
                from: { id: "t2test" }
                to: { id: "sp2test" }
            ) {
                from {
                    id
                }
                to {
                    id
                }
            }
            SprintTic3: AddSprintTickets(
                from: { id: "t3test" }
                to: { id: "sp3test" }
            ) {
                from {
                    id
                }
                to {
                    id
                }
            }
        }`,
    LOGIN_USER: gql`
        mutation($username: String!, $password: String!) {
            loginUser(username: $username, password: $password) {
                token
            }
        }`,
};
module.exports = gqlQueries;
