import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userStories: [{
      id: 'q3ofgqehg9h',
      storyText: 'As a driver, I want to block badly behaved passengers so they are never shown me again.',
      subTasks: true,
      attachedTics: ['5e4d982360b4segsergaf3', '5e4d992f4w3tg3werg2988d'],

    }, {
      id: 'ergsegw45q34',
      storyText: 'As a passenger, I want to link the credit card to my profile so that I can pay for a ride faster, easier and without cash.',
      subTasks: true,
    }, {
      id: 'r34qr34twq3t',
      storyText: 'As a driver, I want to add photos of my car in my profile so that I can attract more users.',
      subTasks: true,
      attachedTics: ['5e4d993w35gwergsdfg988e'],
    },
    {
      id: '34twertw35yw54yg',
      storyText: 'As a passenger, I want several available drivers to be displayed so that I can choose the most suitable option for me.',
      subTasks: true,
    }],
    sprintList: [
      {
        start: '2020-03-17T14:48:00.000Z',
        end: '2020-03-31T14:48:00.000Z',
        attachedTics: ['5e4d982360b4segsergaf3', '5e4d992f4w3tg3werg2988d'],
      },
      {
        start: '2020-04-01T14:48:00.000Z',
        end: '2020-04-15T14:48:00.000Z',
        attachedTics: ['5e4d993w35gwergsdfg988e'],
      },
      {
        start: '2020-04-16T14:48:00.000Z',
        end: '2020-04-30T14:48:00.000Z',
        attachedTics: [],
      },
    ],
    tickList: {
      '5e4d982360b4segsergaf3': {
        projectID: 'firstproject24rrwaefpj',
        issueNumber: 1,
        hourEstimate: 3,
        created: '2020-02-14T17:52:12.652Z',
        lastEdit: '2020-02-14T18:20:07.537Z',
        githubLink: null,
        userStoryId: 'q3ofgqehg9h',
        assigendTo: 'user2',
        title: 'Set Up API',
        creator: 'user1',
        desc: 'Create API for backend and frontend communication so data can be requested from and send to database by client frontend',
        done: false,
      },
      '5e4d992f4w3tg3werg2988d': {
        projectID: 'firstproject24rrwaefpj',
        issueNumber: 2,
        hourEstimate: 3,
        created: '2020-02-14T17:52:12.652Z',
        lastEdit: '2020-02-14T18:20:07.537Z',
        githubLink: {
          label: '2-loginpage-feat',
          lastCommit: '2020-02-10T20:10:42Z',
          oid: 'c1818eb49ee131f70caec9d90370f7ead9febdb4',
          branchUrl: 'https://github.com/studyTim/test/tree/2-loginpage-feat',
        },
        userStoryId: 'q3ofgqehg9h',
        assigendTo: 'user2',
        title: 'login page',
        creator: 'user1',
        desc: 'Create Login Page for users to enter credentials blajds Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.  ',
        done: false,
      },
      '5e4d993w35gwergsdfg988e': {
        projectID: 'firstproject24rrwaefpj',
        issueNumber: 3,
        hourEstimate: 3,
        created: '2020-02-14T17:52:12.652Z',
        lastEdit: '2020-02-14T18:20:07.537Z',
        githubLink: {
          label: 'master',
          lastCommit: '28-11-2019 13:30',
          lastCommitFullDate: '2019-11-28T13:30:31.000Z',
          oid: 'fadf5df57f43ace60d15353157531838b45adc9c',
          branchUrl: 'https://github.com/studyTim/QM_Client/tree/master',
        },
        userStoryId: 'r34qr34twq3t',
        assigendTo: 'user2',
        title: 'Landing page',
        creator: 'user1',
        desc: 'Create landing page for Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. ',
        done: false,
      },
    },
    repoAndBranch: {},
    issueType: Object.freeze({
      USERSTORY: 'User Story',
      TASK: 'Task',
      BUGFIX: 'Bugfix',
      TEST: 'Test',
    }),
    issues: {},
  },
  mutations: {
    set_repoAndBranch(state, obj) {
      state.repoAndBranch = obj;
    },
    set_issues(state, obj) {
      state.issues = obj;
    },
  },
  actions: {
    async fetchRepoAndBranch({ commit }) {
      await Vue.$axios.get('/getRepoInfo')
        .then((response) => {
          commit('set_repoAndBranch', response.data);
          console.log(response.data);
        }, (error) => {
          console.error(`frontend error ${error}`);
        });
    },
    async fetchIssues({ commit }) {
      await Vue.$axios.get('/getIssues')
        .then((response) => {
          commit('set_issues', response.data);
          console.log(response.data);
        }, (error) => {
          console.error(error);
        });
    },
  },
  getters: {
    getUSTicIdsPerSprint: state => (sprintIndex, arrTicketIds) => arrTicketIds
      .filter(tickId => state.sprintList[sprintIndex].attachedTics.includes(tickId)),
    getIssueType: state => state.issueType,
    getIssues: state => state.issues,
    getTicketById: state => tickId => state.tickList[tickId],
    /* eslint-disable no-underscore-dangle */
    getIssueById: state => issueId => state.issues.filter(issue => issueId === issue._id),

    getCompletedTickIds: state => ArrTicketIds => ArrTicketIds
      .filter(tickId => state.tickList[tickId].done === true),
    getUnCompleteTickIds: state => ArrTicketIds => ArrTicketIds
      .filter(tickId => state.tickList[tickId].done === false),
    /* Retrieve tickets in done vs un-complete state based on array of tick Ids passed in */
    getRepoNames: state => state.repoAndBranch.reduce((arr, repo) => {
      arr.push(repo.name);
      return arr;
    }, []),
    getRepoBranches: state => repoName => state.repoAndBranch
      .filter(repo => repoName === repo.name)
      .reduce((arr, repo) => {
        (repo.refs.nodes).forEach((branch) => {
          const currentDatetime = new Date(branch.target.committedDate);
          const formattedDate = `${currentDatetime.getDate()}-${currentDatetime.getMonth() + 1}-${currentDatetime.getFullYear()} ${currentDatetime.getHours()}:${currentDatetime.getMinutes()}`;
          arr.push({
            label: branch.name,
            lastCommit: formattedDate,
            lastCommitFullDate: currentDatetime,
            oid: branch.target.oid,
            repoId: repo.id,
            branchUrl: `${repo.url}/tree/${branch.name}`,
          });
        });
        return arr;
      }, []).sort((a, b) => {
        /* eslint-disable no-param-reassign, no-nested-ternary */
        a = new Date(a.lastCommitFullDate);
        b = new Date(b.lastCommitFullDate);
        return a > b ? -1 : a < b ? 1 : 0;
        /* eslint-enable */
      }),
  },
  modules: {
  },
});
