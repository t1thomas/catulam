/**
 * User Definition
 */
export default {
  id: {
    type: 'uuid',
    primary: true,
  },
  firstName: {
    type: 'string',
    index: true,
  },
  lastName: {
    type: 'string',
    index: true,
  },
  username: {
    type: 'string',
    index: true,
  },
  email: {
    type: 'string',
    index: true,
  },
    password: {
    type: 'string',
    index: true,
  },
  age: 'number',
  knows: {
    type: 'relationship',
    relationship: 'KNOWS',
    direction: 'out',
    properties: {
      since: {
        type: 'localdatetime',
        default: () => new Date(),
      },
    },
  },
  createdAt: {
    type: 'datetime',
    default: () => new Date(),
  },
};
