import gql from 'graphql-tag';

const gqlQueries = {
  TICKET_INFO: gql`
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
        project {
          id
          label
        }
        assignee {
          id
        }
        creator {
          id
        }
      }
    }
  `,
  USER_TASKS: gql`
    query($username: String!) {
      User(filter: { username: $username }) {
        projects {
          id
          label
          tickets(filter: { assignee: { username: $username } }) {
            id
            issueNumber
            title
          }
          userStories(filter: { assignee: { username: $username } }) {
            id
            issueNumber
            storyText
          }
        }
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
      username
      email
      passwordUpdate
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
  StartToSprint: gql`mutation($ticket: _TicketInput! $sprint: _SprintInput!){
    AddTicketSprint(from: $ticket to: $sprint){
      from{id}
      to{id}
    }
  }`,
  SprintToStart: gql`mutation($ticket: _TicketInput! $sprint: _SprintInput!){
    RemoveTicketSprint(from: $ticket to:$sprint){
      from{id}
      to{id}
    }
  }`,
  SwitchUserStory: {
    storySwitch: gql`mutation($ticket: String! $usFrom: String! $usTo: String!){
    TicSwitchUStory(tickId: $ticket UStoryIdFrom: $usFrom UStoryIdTo: $usTo)
  }
  `,
    AddNewSprint: gql`mutation(
      $ticket: _TicketInput!
      $sprintAdd: _SprintInput!
      $uStoryRemove: _UserStoryInput!
      $uStoryAdd: _UserStoryInput!
    ) {
      RemoveTicketUserStory(from: $ticket, to: $uStoryRemove) {
        from {
          id
        }
        to {
          id
        }
      }
      AddTicketUserStory(from: $ticket, to: $uStoryAdd) {
        from {
          id
        }
        to {
          id
        }
      }
      AddTicketSprint(from: $ticket, to: $sprintAdd) {
        from {
          id
        }
        to {
          id
        }
      }
    }`,
    RemoveSprint: gql`mutation(
      $ticket: _TicketInput!
      $sprintRemove: _SprintInput!
      $uStoryRemove: _UserStoryInput!
      $uStoryAdd: _UserStoryInput!
    ) {
      RemoveTicketUserStory(from: $ticket, to: $uStoryRemove) {
        from {
          id
        }
        to {
          id
        }
      }
      AddTicketUserStory(from: $ticket, to: $uStoryAdd) {
        from {
          id
        }
        to {
          id
        }
      }
      RemoveTicketSprint(from: $ticket, to: $sprintRemove) {
        from {
          id
        }
        to {
          id
        }
      }
    }`,
    ChangeSprint: gql`mutation(
      $ticket: _TicketInput!
      $sprintRemove: _SprintInput!
      $sprintAdd: _SprintInput!
      $uStoryRemove: _UserStoryInput!
      $uStoryAdd: _UserStoryInput!
    ) {
      RemoveTicketUserStory(from: $ticket, to: $uStoryRemove) {
        from {
          id
        }
        to {
          id
        }
      }
      AddTicketUserStory(from: $ticket, to: $uStoryAdd) {
        from {
          id
        }
        to {
          id
        }
      }
      RemoveTicketSprint(from: $ticket, to: $sprintRemove) {
        from {
          id
        }
        to {
          id
        }
      }
      AddTicketSprint(from: $ticket, to: $sprintAdd) {
        from {
          id
        }
        to {
          id
        }
      }
    }`,
  },
};
export default gqlQueries;
