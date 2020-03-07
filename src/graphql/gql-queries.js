
const gqlQueries = {
  USWithTickIds: `
  query UserStory {
    id
    storyText
    tickets {
      id
    }
  }`,
};
export default gqlQueries;
