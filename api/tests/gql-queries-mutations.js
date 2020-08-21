const gql = require('graphql-tag');

const gqlQueries = {
  ADD_USER_PROJECT: gql`
        mutation {
            AddUserProjects(from: { id: "user1test" }, to: { id: "p1test" }) {
                from {
                    id
                }
                to {
                    id
                }
            }
        }`,
  ADD_PROJECT_DATA: gql`
        mutation {
            AddSprintProject(from: { id: "sp1test" }, to: { id: "p1test" }) {
                from {
                    id
                }
                to {
                    id
                }
            }
            AddTicketProject(from: { id: "t1test" }, to: { id: "p1test" }) {
                from {
                    id
                }
                to {
                    id
                }
            }
            AddUserStoryProject(from: { id: "us1test" }, to: { id: "p1test" }) {
                from {
                    id
                }
                to {
                    id
                }
            }
        }`,
  CREATE_PROJECT: gql`
        mutation(
            $title: String!
            $desc: String
            $label: String!
            $startDate: String!
            $endDate: String!
            $members: [_UserInput]!
        ) {
            CreateProject(
                title: $title
                label: $label
                desc: $desc
                startDate: $startDate
                endDate: $endDate
                members: $members
            ) {
                id
                title
                label
                startDate
                endDate
                desc
                noOfTicks
                noOfSprints
                members {
                    id
                    role
                }
            }
        }`,
  CURRENT_USER: gql`query {
        getCurrentUser {
            id
            firstName
            lastName
            username
            email
            password
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
        ) {
            CreateUser(
                id: $id
                firstName: $firstName
                lastName: $lastName
                username: $username
                email: $email
                password: $password
            ){
                id
                firstName
                lastName
                username
                email
                password
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
            uStory1: CreateUserStory(storyText: "As a User I want to be able to first see a dashboard on my landing page", id: "us1test", issueNumber: 4) {
                storyText
                id
                issueNumber
            }
            uStory2: CreateUserStory(storyText: "As a user I want to securely login to the app using my credentials", id: "us2test", issueNumber: 5) {
                storyText
                id
                issueNumber
            }
            uStory3: CreateUserStory(storyText: "As a user I my profile data to be shown in my dashboard", id: "us3test", issueNumber: 6) {
                storyText
                id
                issueNumber
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
  ADD_SPRINT_TICKETS: gql`
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

  LOGIN_USER: gql`mutation($username: String!, $password: String!) {
    loginUser(username: $username, password: $password)
  }`,
  LOGIN_USER_graphql_request: /* GraphQL */`mutation($username: String!, $password: String!) {
    loginUser(username: $username, password: $password)
  }`,
};
module.exports = gqlQueries;
