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
};
export default gqlQueries;
