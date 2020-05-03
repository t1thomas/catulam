import gql from 'graphql-tag';

const gqlQueries = {
  SUB_BACKLOG_UPDATE: gql`
    subscription($proId: String!) {
      update(proId: $proId)
    }`,
  CREATE_TICKET: gql`
    mutation(
      $hourEstimate: Int
      $title: String!
      $desc: String
      $project: _ProjectInput!
      $user: _UserInput!
    ) {
      CreateTicket(
        hourEstimate: $hourEstimate
        title: $title
        desc: $desc
        project: $project
        user: $user
      ) {
        id
      }
    }`,
  BACKLOG_DATA: gql`
    query($id: ID!) {
    Project(filter: { id: $id }) {
      id
      title
      desc
      label
      userStories {
        id
        tickets {
          id
          done
          sprint {
            id
          }
        }
      }
      unAss: tickets(filter: { userStory: null }) {
        id
        done
        sprint {
          id
        }
      }
      sprints {
        id
        sprintNo
      }
    }
  }`,
  CURR_PROJECT_ELEMENTS: gql`
    query($id: ID!) {
      Project(filter: { id: $id }) {
        userStories {
          id
          storyText
        }
        members {
          User {
            id
            avatar
            firstName
            lastName
            fullName
          }
        }
        tickets {
          assignee {
            id
          }
          id
          title
          issueNumber
          desc
          hourEstimate
          sprint {
            id
          }
        }
        sprints {
          id
          sprintNo
        }
      }
    }`,
  ALL_USERS: gql`
    query {
      User {
        id
        firstName
        lastName
        fullName
        email
          projects {
            Project {
              id
            }
          }
        userStories {
          id
        }
        tickets {
          id
          done
        }
        avatar
      }
    }`,
  UPDATE_TICKET_DESC: gql`
    mutation($id: ID!, $desc: String!) {
      UpdateTicket(id: $id, desc: $desc) {
        id
        desc
      }
    }
  `,
  UPDATE_TICKET_ETIME: gql`
    mutation($id: ID!, $hrs: Int!) {
      UpdateTicket(id: $id, hourEstimate: $hrs) {
        id
        hourEstimate
      }
    }
  `,
  UPDATE_TICKET_ASSIGNEE: gql`
    mutation(
      $tick: _TicketInput!
      $remUser: _UserInput
      $addUser: _UserInput
      $project: _ProjectInput!
    ) {
      UpdateTicketAssignee(
        tick: $tick
        remUser: $remUser
        addUser: $addUser
        project: $project
      ) {
        id
      }
    }`,
  CURRENT_TICKET: gql`
    query($id: ID!) {
      Ticket(filter: { id: $id }) {
        id
        issueNumber
        hourEstimate
        userStory {
          id
          issueNumber
          storyText
        }
        title
        desc
        done
        sprint {
          id
          sprintNo
        }
        assignee {
          id
        }
        creator {
          User {
            id
          }
          timestamp
        }
      }
    }`,
  USER_TASKS: gql`
    query($username: String!) {
      User(filter: { username: $username }) {
        projects {
          Project {
            id
            label
            tickets(filter: { assignee: { username: $username } }) {
              id
              issueNumber
              title
            }
          }
        }
      }
    }`,
  S_PLANNER_DATA: gql`
    query ($id: ID!){
      Project(filter: { id: $id }) {
        startDate
        endDate
        sprints {
          id
          sprintNo
          tickets {
            id
          }
        }
      }
    }`,
  PM_TASKS: gql`
    query($username: String!) {
      User(filter: { username: $username }) {
        projects {
          Project {
            id
            label
            startDate
            endDate
            sprints {
              id
              sprintNo
              active
            }
            tickets {
              id
              issueNumber
              title
              done
              hourEstimate
              assignee {
                id
              }
            }
            userStories {
              id
              storyText
              tickets {
                id
              }
            }
            members {
              User {
                id
                firstName
                lastName
                fullName
                avatar
              }
              type
            }
          }
        }
      }
    }`,
  CREATE_PROJECT: gql`
    mutation(
      $id: ID
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
        id: $id
        startDate: $startDate
        endDate: $endDate
        members: $members
      ) {
        id
        title
      }
    }`,
  PROJECTS: gql`
    query {
      Project {
        id
        title
        desc
        label
        members {
          id
        }
        userStories {
          id
        }
        tickets {
          id
        }
        sprints {
          id
        }
      }
    }`,
  RESET_PASS: gql`mutation($username: String!, $newPassword: String!) {
    resetPassword(username: $username, newPassword: $newPassword) {
      token
    }
  }`,
  SignInUser: gql`mutation($username: String!, $password: String!) {
      loginUser(username: $username, password: $password){
        token
      }
    }`,
  DeleteToken: gql`mutation($token: String!) {
    DeleteToken(token: $token){
      token
    }
  }
  `,
  USWithTickIds: gql`query{
    UserStory {
      id
      storyText
      ticketIds
    }
  }`,
  CurrentUser: gql`query {
    getCurrentUser {
      id
      firstName
      lastName
      fullName
      username
      email
      passwordUpdate
      avatar
      type
    }
  }`,
  Tickets: gql`query{
    Ticket {
      id
      issueNumber
      hourEstimate
      userStory {
        id
      }
      title
      creator
      desc
      done
      sprint {
        id
      }
    }
  }`,
  Sprints: gql`query{
    Sprint{
      id
      sprintNo
      tickets{
        id
        userStory{
          id
        }
      }
    }
  }`,
  BackLogData: gql`query{
    UserStory{
      id
      storyText
      tickets{
        id
        done
        sprint{
          id
        }
      }
    }
  }`,
  SwitchStartSprint: {
    TIC_ADD_SPRINT: gql`
      mutation(
        $project: _ProjectInput!
        $tick: _TicketInput!
        $sprintAdd: _SprintInput!
      ) {
        StartToSprint(
          project: $project
          tick: $tick
          sprintAdd: $sprintAdd
        )
      }`,
    TIC_REMOVE_SPRINT: gql`
      mutation(
        $project: _ProjectInput!
        $tick: _TicketInput!
        $sprintRemove: _SprintInput!
      ) {
        SprintToStart(
          project: $project
          tick: $tick
          sprintRemove: $sprintRemove
        )
      }`,
  },
  SwitchUnassigned: {
    UNASSIGNED_TICK_SWITCH: gql`
      mutation(
        $project: _ProjectInput!
        $tick: _TicketInput!
        $uStoryRemove: _UserStoryInput
        $sprintRemove: _SprintInput
        $uStoryAdd: _UserStoryInput
        $sprintAdd: _SprintInput
      ) {
        UnassignedTicketSwitch(
          project: $project
          tick: $tick
          uStoryRemove: $uStoryRemove
          sprintRemove: $sprintRemove
          uStoryAdd: $uStoryAdd
          sprintAdd: $sprintAdd
        )
      }`,
  },
  SwitchUserStory: {
    USTORY_TICKET_SWITCH: gql`
      mutation(
        $project: _ProjectInput!
        $tick: _TicketInput!
        $uStoryRemove: _UserStoryInput
        $sprintRemove: _SprintInput
        $uStoryAdd: _UserStoryInput
        $sprintAdd: _SprintInput
      ) {
        UStoryTicketSwitch(
          project: $project
          tick: $tick
          uStoryRemove: $uStoryRemove
          sprintRemove: $sprintRemove
          uStoryAdd: $uStoryAdd
          sprintAdd: $sprintAdd
        )
      }`,
  },
};
export default gqlQueries;
