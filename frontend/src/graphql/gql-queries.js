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
  SUB_ADD_PRO_MEMBER: gql`
    subscription($user: _UserInput!) {
      addProMem(user: $user)
  }`,
  SUB_MEMBER_REMOVE: gql`
    subscription($user: _UserInput!) {
      removeProMem(user: $user)
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
  SUB_SPRINT_UPDATE: gql`
    subscription($project: _ProjectInput!) {
      spUpdate(project: $project)
    }`,
  SUB_SPRINT_DELETE: gql`
    subscription($project: _ProjectInput!) {
      spDelete(project: $project)
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
        sprintPos
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
    $startDate: String!,
    $endDate: String!,
    $project: _ProjectInput!
    ) {
      CreateSprint(
        startDate: $startDate,
        endDate: $endDate,
        project: $project
      ) {
        id
        active
        sprintNo
        startDate
        endDate
        project {
          id
        }
      }
    }`,
  UPDATE_SPRINT: gql`
    mutation(
    $sprint: _SprintInput!,
    $active: Boolean,
    $startDate: String,
    $endDate: String,
  ) {
    UpdateSprint(
      sprint: $sprint,
      active: $active,
      startDate: $startDate,
      endDate: $endDate,
    ) {
      id
      active
      startDate
      endDate
      project {
        id
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
  UPDATE_VIEWING_PRO: gql`mutation($project: _ProjectInput!) {
    UpdateViewingProject(project: $project)
  }`,
  // All elements required for the application filter each element so the is member of
  PROJECT_ELEMENTS: gql`query($username: String!) {
    PROJECTS: Project(filter: { members_single: { username: $username } }) {
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

    TICKETS: Ticket(
      filter: { project: { members_some: { username: $username } } }
    ) {
      id
      issueNumber
      title
      done
      desc
      hourEstimate
      creation_time
      sprintPos
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
      userStory {
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

    USER_STORIES: UserStory(
      filter: { project: { members_some: { username: $username } } }
    ) {
      id
      storyText
      project {
        id
      }
    }
    SPRINTS: Sprint(
      filter: { project: { members_some: { username: $username } } }
    ) {
      id
      sprintNo
      active
      startDate
      endDate
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
        noOfSprints
        members {
          id
          role
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
        newHourEstimate
        prevHourEstimate
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
    mutation($member: _UserInput!, $project: _ProjectInput!) {
      AddProjectMember(member: $member, project: $project) {
        id
        role
      }
    }`,
  REMOVE_PROJECT_MEMBER: gql`
    mutation($member: _UserInput!, $project: _ProjectInput!) {
      RemoveProjectMember(member: $member, project: $project) {
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
      mutation($tick: _TicketInput!, $from: String!) {
        TicToToDo(tick: $tick, from: $from) {
          id
          sprintPos
          done
          project {
            id
          }
        }
      }
    `,
    MOVE_TO_DOING: gql`
      mutation($tick: _TicketInput!, $from: String!) {
        TicToDoing(tick: $tick, from: $from) {
          id
          sprintPos
          done
          project {
            id
          }
        }
      }`,
    MOVE_TO_DONE: gql`
      mutation($tick: _TicketInput!) {
        TicToDone(tick: $tick) {
          id
          sprintPos
          done
          project {
            id
          }
        }
      }
    `,
  },
  TICKET_LOCATION_CHANGE: gql`
      mutation(
        $project: _ProjectInput!
        $tick: _TicketInput!
        $uStoryRemove: _UserStoryInput
        $sprintRemove: _SprintInput
        $uStoryAdd: _UserStoryInput
        $sprintAdd: _SprintInput
      ) {
        TicketLocSwitch(
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
};
export default gqlQueries;
