const devScopes = [
  'User:Read',
  'User:Update',
  'UserStory:Create',
  'UserStory:Read',
  'UserStory:Update',
  'UserStory:Delete',
  'Ticket:Create',
  'Ticket:Read',
  'Ticket:Update',
  'Ticket:Delete',
  'Ticket:Comment',
  'Ticket:Commit',
  'Sprint:Read',
  'Sprint:Update',
  'Project:Read',
];
// pm has a few extra scopes
const pmScopes = () => [...devScopes, ...['Sprint:Create', 'Project:Create', 'Project:UpdateMembers']];

module.exports = {
  dev: devScopes,
  pm: pmScopes(),
};
// return authentication scopes to be added to JWT for each user role type.
