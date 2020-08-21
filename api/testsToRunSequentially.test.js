const dataMutations = require('./tests/dataMutations.js');
// const userMutations = require('./tests/userMutations.js');

describe('sequentially run tests', () => {
  dataMutations();
  // userMutations();
});
