module.exports = {
  pm: () => ['UserStory:read', 'Project:read', 'Ticket:read', 'Sprint:read', 'User:read'],
  dev: () => ['UserStory:read', 'Project:read', 'Ticket:read', 'Sprint:read', 'User:read'],
  admin: () => ['User:Create'],
};
// return authentication scopes to be added to JWT for each user role type.
