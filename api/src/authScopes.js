module.exports = {
  pm: () => ['UserStory:Read', 'UserStory:Create', 'Project:Read', 'Ticket:Read', 'Ticket:Edit', 'Ticket:Create', 'Sprint:Edit', 'Sprint:Create', 'Sprint:Read', 'User:Read', 'Project:Create', 'Project:EditMembers'],
  dev: () => ['UserStory:Read', 'UserStory:Create', 'Project:Read', 'Ticket:Read', 'Ticket:Edit', 'Ticket:Create', 'Sprint:Edit', 'Sprint:Read', 'User:Read'],
  admin: () => ['User:Create'],
};
// return authentication scopes to be added to JWT for each user role type.
