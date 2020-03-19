import gql from 'graphql-tag';

const gqlQueries = {
  USWithTickIds: gql`
  query{
    UserStory {
      id
      storyText
      ticketIds
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
      assigendTo
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
  StartToSprint: gql`mutation AddTicketSprint($ticket: _TicketInput! $sprint: _SprintInput!){
    AddTicketSprint(from: $ticket to: $sprint){
      from{id}
      to{id}
    }
  }`,
  SprintToStart: gql`mutation RemoveTicketSprint($ticket: _TicketInput! $sprint: _SprintInput!){
    RemoveTicketSprint(from: $ticket to:$sprint){
      from{id}
      to{id}
    }
  }`,
  SwitchUserStory: gql`mutation TicSwitchSprint($ticket: String! $usFrom: String! $usTo: String!){
    TicSwitchUStory(tickId: $ticket UStoryIdFrom: $usFrom UStoryIdTo: $usTo)
  }
  `,
};
export default gqlQueries;
