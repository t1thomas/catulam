import gql from 'graphql-tag';

const gqlQueries = {
  REFRESH_TOKEN: gql`
    mutation {
      refreshAccess
    }`,
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
        title
        issueNumber
        project {
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
        issueNumber
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
  BACKLOG_DATA: gql`
    query($id: ID!) {
      noUsNoSp: Project(filter: { id: $id }) {
        tickets(
          filter: { AND: [{ done: false }, { userStory: null }, { sprint: null }] }
        ) {
          id
        }
      }
      noUsSp: Project(filter: { id: $id }) {
        tickets(
          filter: {
            AND: [{ done: false }, { userStory: null }, { sprint_not: null }]
          }
        ) {
          id
          sprint {
            id
          }
        }
      }
      UsNoSp: Project(filter: { id: $id }) {
        tickets(
          filter: {
            AND: [{ done: false }, { userStory_not: null }, { sprint: null }]
          }
        ) {
          id
          userStory {
            id
          }
        }
      }
      UsSp: Project(filter: { id: $id }) {
        tickets(
          filter: {
            AND: [{ done: false }, { userStory_not: null }, { sprint_not: null }]
          }
        ) {
          id
          sprint {
            id
          }
          userStory{
            id
          }
        }
      }
      DUS: Project(filter: { id: $id }) {
        tickets(filter: { AND: [{ done: true }, { userStory_not: null }] }) {
          id
          userStory {
            id
          }
        }
      }
      DnoUS: Project(filter: { id: $id }) {
        tickets(filter: { AND: [{ done: true }, { userStory: null }] }) {
          id
        }
      }
    }
  `,
  CURR_PROJECT_ELEMENTS: gql`
    query($id: ID!) {
      Project(filter: { id: $id }) {
        id
        title
        label
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
  UPDATE_USER_STORY_TEXT: gql`
    mutation($id: ID!, $storyText: String!) {
      UpdateUserStory(id: $id, storyText: $storyText) {
        id
        project {
          id
        }
      }
    }`,
  DELETE_USER_STORY: gql`
    mutation($id: ID!) {
      DeleteUserStory(id: $id) {
        project {
          id
        }
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
  DELETE_TICKET: gql`
    mutation($ticket: _TicketInput!, $project: _ProjectInput!) {
      DeleteTicket(ticket: $ticket, project: $project) {
        title
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
        project {
          id
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
  // All Projects that currentUser is member of
  PROJECTS: gql`query($username: String!) {
    Project(filter: { members_single: { User: { username: $username } } }) {
      id
      title
      label
      startDate
      endDate
      desc
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
      hourEstimate
      assignee {
        id
      }
      project {
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
      issueNumber
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
  PM_PROJECTS: gql`
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
              startDate
              endDate
              tickets {
                id
                done
              }
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
              role
            }
          }
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
      avatar
      role
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
        $ticket: _TicketInput!
        $sprintAdd: _SprintInput!
      ) {
        StartToSprint(
          ticket: $ticket
          sprintAdd: $sprintAdd
        )
        {
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
    TIC_REMOVE_SPRINT: gql`
      mutation(
        $ticket: _TicketInput!
        $sprintRemove: _SprintInput!
      ) {
        SprintToStart(
          ticket: $ticket
          sprintRemove: $sprintRemove
        ){
          title
          issueNumber
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
