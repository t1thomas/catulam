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
    ticketsAsMap
  }`,
  Sprints: gql`query{
    Sprint{
      id
      sprintNo
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
};
export default gqlQueries;
