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
        tickets(filter: { userStory: null }) {
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
          id
          avatar
          firstName
          lastName
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
        email
        projects {
          id
        }
        userStories {
          id
        }
        tickets {
          id
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
  UPDATE_USER_TICKET: gql`mutation(
    $tickId: _TicketInput!
    $remUserID: _UserInput!
    $addUserID: _UserInput!
  ) {
    RemoveUserTickets(from: $remUserID, to: $tickId) {
      from {
        id
      }
      to {
        id
      }
    }
    AddUserTickets(from: $addUserID, to: $tickId) {
      from {
        id
      }
      to {
        id
      }
    }
  }`,
  REM_USER_TICKET: gql`
    mutation($userID: _UserInput!, $tickId: _TicketInput!) {
      RemoveUserTickets(from: $userID, to: $tickId) {
        from {
          id
        }
        to {
          id
        }
      }
    }`,
  ADD_USER_TICKET: gql`
    mutation($userID: _UserInput!, $tickId: _TicketInput!) {
      AddUserTickets(from: $userID, to: $tickId) {
        from {
          id
        }
        to {
          id
        }
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
      avatar
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
  SwitchUnassigned: {
    REMOVE_USERSTORY: gql`mutation(
      $ticket: _TicketInput!
      $uStoryRemove: _UserStoryInput!
    ) {
      RemoveTicketUserStory(from: $ticket, to: $uStoryRemove) {
        from {
          id
        }
        to {
          id
        }
      }
    }`,
    REMOVE_USERSTORY_REMOVE_SPRINT: gql`mutation(
      $ticket: _TicketInput!
      $uStoryRemove: _UserStoryInput!
      $sprintRemove: _SprintInput!
    ) {
      RemoveTicketUserStory(from: $ticket, to: $uStoryRemove) {
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
    ADD_NEW_USERSTORY: gql`mutation(
      $ticket: _TicketInput!
      $uStoryAdd: _UserStoryInput!
    ) {
      AddTicketUserStory(from: $ticket, to: $uStoryAdd) {
        from {
          id
        }
        to {
          id
        }
      }
    }`,
    ADD_NEW_USERSTORY_ADD_NEW_SPRINT: gql`mutation(
      $ticket: _TicketInput!
      $uStoryAdd: _UserStoryInput!
      $sprintAdd: _SprintInput!
    ) {
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
  },
  SwitchUserStory: {
    storySwitch: gql`mutation($ticket: String! $usFrom: String! $usTo: String!){
     TicSwitchUStory(tickId: $ticket UStoryIdFrom: $usFrom UStoryIdTo: $usTo)
    }`,
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
