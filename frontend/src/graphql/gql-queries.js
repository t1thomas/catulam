import gql from 'graphql-tag';

const gqlQueries = {
  REFRESH_TOKEN: gql`
    mutation {
      refreshAccess
    }
  `,
  REFRESH_TOKEN_graphql_request: /* GraphQL */`
    mutation {
      refreshAccess
    }
  `,
  SUB_BACKLOG_UPDATE: gql`
    subscription($proId: String!) {
      update(proId: $proId)
    }`,
  SUB_TICKET_UPDATE: gql`
    subscription($project: _ProjectInput!) {
    tickUpdate(project: $project)
  }`,
  SUB_TICKET_DELETE: gql`
    subscription($project: _ProjectInput!) {
      tickDelete(project: $project)
    }`,
  SUB_USTORY_UPDATE: gql`
    subscription($project: _ProjectInput!) {
      uSUpdate(project: $project)
    }`,
  SUB_USTORY_DELETE: gql`
    subscription($project: _ProjectInput!) {
      uSDelete(project: $project)
    }`,
  CREATE_TICKET: gql`
    mutation(
      $hourEstimate: Int
      $title: String!
      $desc: String
      $project: _ProjectInput!
    ) {
      CreateTicket(
        hourEstimate: $hourEstimate
        title: $title
        desc: $desc
        project: $project
      ) {
        id
        issueNumber
        title
        done
        desc
        hourEstimate
        creation_time
        assignee {
          id
        }
        project {
          id
        }
        sprint {
          id
          sprintNo
        }
        comments {
          id
          timestamp
          message
          User {
            id
          }
        }
        userStory{
          id
        }
        commits {
          id
          message
          timestamp
          newHourEstimate
          prevHourEstimate
          User {
            id
          }
        }
        creator {
            id
        }
      }
    }`,
  CREATE_USER_STORY: gql`
    mutation(
    $storyText: String!,
    $project: _ProjectInput!
    ) {
      CreateUserStory(
        storyText: $storyText,
        project: $project
      ) {
        id
        storyText
        project {
          id
        }
      }
    }`,
  CREATE_SPRINT: gql`
    mutation(
    $sprintNo: Int!,
    $active: Boolean!,
    $startDate: String!,
    $endDate: String!,
    $project: _ProjectInput!
    ) {
      CreateSprint(
        sprintNo: $sprintNo,
        active: $active,
        startDate: $startDate,
        endDate: $endDate,
        project: $project
      ) {
        id
        sprintNo
        project {
          id
        }
      }
    }`,
  BACKLOG_DATA: gql`query($id: ID!) {
    noUsNoSp: Ticket(
      filter: {
        project: { id: $id }
        AND: [{ done: false }, { userStory: null }, { sprint: null }]
      }
    ) {
      id
    }
    noUsSp: Ticket(
      filter: {
        project: { id: $id }
        AND: [{ done: false }, { userStory: null }, { sprint_not: null }]
      }
    ) {
      id
      sprint {
        id
      }
    }
    UsNoSp: Ticket(
      filter: {
        project: { id: $id }
        AND: [{ done: false }, { userStory_not: null }, { sprint: null }]
      }
    ) {
      id
      userStory {
        id
      }
    }
    UsSp: Ticket(
      filter: {
        project: { id: $id }
        AND: [{ done: false }, { userStory_not: null }, { sprint_not: null }]
      }
    ) {
      id
      sprint {
        id
      }
      userStory {
        id
      }
    }
    DUS: Ticket(
      filter: {
        project: { id: $id }
        AND: [{ done: true }, { userStory_not: null }]
      }
    ) {
      id
      userStory {
        id
      }
    }
    DnoUS: Ticket(
      filter: { project: { id: $id }, AND: [{ done: true }, { userStory: null }] }
    ) {
      id
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
        avatar
      }
    }`,
  UPDATE_USER_STORY_TEXT: gql`
    mutation($uStory: _UserStoryInput!, $storyText: String!) {
      UpdateUserStory(uStory: $uStory, storyText: $storyText) {
        id
        storyText
        project {
          id
        }
      }
    }`,
  DELETE_USER_STORY: gql`
    mutation($uStory: _UserStoryInput!, $project: _ProjectInput!) {
      DeleteUserStory(uStory: $uStory, project: $project) {
        id
      }
    }`,
  DELETE_TICKET: gql`
    mutation($tick: _TicketInput!, $project: _ProjectInput!) {
      DeleteTicket(tick: $tick, project: $project) {
        id
      }
    }
  `,
  UPDATE_TICKET_DESC: gql`
    mutation($tick: _TicketInput!, $desc: String!) {
      UpdateTicket(tick: $tick, desc: $desc) {
        id
        desc
        project {
          id
        }
      }
    }
  `,
  UPDATE_TICKET_ETIME: gql`
    mutation($tick: _TicketInput!, $hrs: Int!) {
      UpdateTicket(tick: $tick, hourEstimate: $hrs) {
        id
        hourEstimate
        project {
          id
        }
      }
    }
  `,
  UPDATE_TICKET_ASSIGNEE: gql`
    mutation(
      $tick: _TicketInput!,
      $user: _UserInput!,
    ) {
      UpdateTicketAssignee(
        tick: $tick
        user: $user
      ) {
        id
        assignee {
          id
        }
        project {
          id
        }
      }
    }`,
  REMOVE_TICKET_ASSIGNEE: gql`
    mutation(
      $tick: _TicketInput!,
    ) {
      RemoveTicketAssignee(
        tick: $tick
      ) {
        id
        assignee {
          id
        }
        project {
          id
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
            sprints {
              id
              sprintNo
              active
            }
            tickets(filter: { assignee: { username: $username } }) {
              id
              issueNumber
              title
              hourEstimate
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
          startDate
          endDate
          sprintNo
          active
          tickets {
            id
            done
          }
        }
      }
    }`,
  SPRINT_BOARD_DATA: gql`
    query($id: ID!) {
      pos0: Sprint(filter: { id: $id }) {
        tickets(filter: { AND: [{ done: false }, { sprintPos: 0 }] }) {
          id
        }
      }
      pos1: Sprint(filter: { id: $id }) {
        tickets(filter: { AND: [{ done: false }, { sprintPos: 1 }] }) {
          id
        }
      }
      posDone: Sprint(filter: { id: $id }) {
        tickets(filter: { AND: [{ done: true }, { sprintPos: 2 }] }) {
          id
        }
      }
    }`,
  UPDATE_VIEWING_PRO: gql`mutation($project: _ProjectInput!) {
    UpdateViewingProject(project: $project)
  }`,
  // All Projects that currentUser is member of
  PROJECTS: gql`query($username: String!) {
    Project(filter: { members_single: { User: { username: $username } } }) {
      id
      title
      label
      startDate
      endDate
      desc
      noOfTicks
      members {
        User {
          id
        }
        role
      }
      sprints {
        id
      }
      tickets {
        id
      }
    }
  }`,
  // All Tickets from projects that currentUser is member of
  TICKETS: gql`query($username: String!) {
    Ticket(
      filter: { project: { members_some: { User: { username: $username } } } }
    ) {
      id
      issueNumber
      title
      done
      desc
      hourEstimate
      creation_time
      assignee {
        id
      }
      project {
        id
      }
      sprint {
        id
        sprintNo
      }
      comments {
        id
        timestamp
        message
        User {
          id
        }
      }
      userStory{
        id
      }
      commits {
        id
        message
        timestamp
        newHourEstimate
        prevHourEstimate
        User {
          id
        }
      }
      creator {
        id
      }
    }
  }`,
  USER_STORIES: gql`query($username: String!) {
    UserStory(
      filter: { project: { members_some: { User: { username: $username } } } }
    ) {
      id
      storyText
      project {
        id
      }
    }
  }`,
  SPRINTS: gql`query($username: String!) {
    Sprint(
      filter: { project: { members_some: { User: { username: $username } } } }
    ) {
      id
      sprintNo
      active
      startDate
      endDate
      tickets {
        id
        done
      }
      project {
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
        members {
          User {
            id
          }
          role
        }
        sprints {
          id
        }
        tickets {
          id
        }
      }
    }`,
  SignInUser: gql`mutation($username: String!, $password: String!) {
      loginUser(username: $username, password: $password)
    }`,
  // deletetoken is auto gen
  logout: gql`mutation {
    logout
  }
  `,
  ADD_TICKET_COMMENT: gql`mutation(
    $tick: _TicketInput!
    $message: String!
  ) {
    AddTicketComments(
      tick: $tick
      message: $message
    ) {
      id
      comments {
        id
        timestamp
        message
        User {
          id
        }
      }
      project {
        id
      }
    }
  }`,
  ADD_TICKET_COMMIT: gql`mutation(
    $tick: _TicketInput!
    $commit: _CommitInput!
  ) {
    AddTicketCommits(
      tick: $tick
      commit: $commit
    ) {
      id
      hourEstimate
      commits {
        id
        timestamp
        message
        User {
          id
        }
      }
      project {
        id
      }
    }
  }`,
  USWithTickIds: gql`query{
    UserStory {
      id
      storyText
      ticketIds
    }
  }`,
  CURRENT_USER: gql`query {
    getCurrentUser {
      id
      firstName
      lastName
      fullName
      username
      email
      avatar
      role
      viewingPro
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
  ADD_PROJECT_MEMBER: gql`
    mutation($members: [_UserInput]!, $project: _ProjectInput!) {
      AddProjectMembers(members: $members, project: $project) {
        id
      }
    }`,
  REMOVE_PROJECT_MEMBER: gql`
    mutation($members: [_UserInput]!, $project: _ProjectInput!) {
      RemoveProjectMembers(members: $members, project: $project) {
        id
      }
    }`,
  SwitchStartSprint: {
    TIC_ADD_SPRINT: gql`
      mutation(
        $tick: _TicketInput!
        $sprintAdd: _SprintInput!
      ) {
        StartToSprint(
          tick: $tick
          sprintAdd: $sprintAdd
        )
        {
          id
          sprint {
            id
          }
          project {
            id
          }
        }
      }`,
    TIC_REMOVE_SPRINT: gql`
      mutation(
        $tick: _TicketInput!
        $sprintRemove: _SprintInput!
      ) {
        SprintToStart(
          tick: $tick
          sprintRemove: $sprintRemove
        ){
          id
          sprint {
            id
          }
          project {
            id
          }
        }
      }`,
    TIC_CHANGE_SPRINT: gql`
      mutation(
        $ticket: _TicketInput!
        $sprintAdd: _SprintInput!
        $sprintRemove: _SprintInput!
      ) {
        SwitchSprint(
          ticket: $ticket
          sprintAdd: $sprintAdd
          sprintRemove: $sprintRemove
        ){
          title
          issueNumber
          sprint {
            sprintNo
          }
          project {
            id
          }
        }
      }`,
  },
  sBoardTicMove: {
    MOVE_TO_TODO: gql`
      mutation($ticket: _TicketInput!, $from: String!) {
        TicToToDo(ticket: $ticket, from: $from) {
          id
          title
          issueNumber
          project {
            id
          }
        }
      }
    `,
    MOVE_TO_DOING: gql`
      mutation($ticket: _TicketInput!, $from: String!) {
        TicToDoing(ticket: $ticket, from: $from) {
          id
          title
          issueNumber
          project {
            id
          }
        }
      }`,
    MOVE_TO_DONE: gql`
      mutation($ticket: _TicketInput!) {
        TicToDone(ticket: $ticket) {
          id
          title
          issueNumber
          project {
            id
          }
        }
      }
    `,
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
        ) {
          id
          project {
            id
          }
          sprint {
            id
            sprintNo
          }
          userStory{
            id
          }
        }
      }`,
  },
};
export default gqlQueries;
