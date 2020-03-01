import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tickList: [
      {
        _id: '5e4d982360b4segsergaf3',
        projectID: 'firstproject24rrwaefpj',
        issueNumber: 1,
        hourEstimate: 3,
        created: '2020-02-14T17:52:12.652Z',
        lastEdit: '2020-02-14T18:20:07.537Z',
        githubLink: null,
        assigendTo: 'user2',
        title: 'Set Up API',
        creator: 'user1',
        desc: 'Create API for backend and frontend communication so data can be requested from and send to database by client frontend',
        done: false,
      },
      {
        _id: '5e4d992f4w3tg3werg2988d',
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
        assigendTo: 'user2',
        title: 'login page',
        creator: 'user1',
        desc: 'Create Login Page for users to enter credentials blajds Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.  ',
        done: false,
      },
      {
        _id: '5e4d993w35gwergsdfg988e',
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
        assigendTo: 'user2',
        title: 'Landing page',
        creator: 'user1',
        desc: 'Create landing page for Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. ',
        done: true,
      },
    ],
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
    getIssueType: state => state.issueType,
    getIssues: state => state.issues,
    /* eslint-disable no-underscore-dangle */
    getIssueById: state => issueId => state.issues.filter(issue => issueId === issue._id),
    getCompletedTicksByIds: state => ArrTicketIds => state.tickList.reduce((arrList, ticket) => {
      ArrTicketIds.forEach((tickId) => {
        if (ticket._id === tickId && ticket.done === true) {
          arrList.push(ticket);
        }
      });
      return arrList;
    }, []),
    /* Retrieve tickets in done vs un-complete state based on array of tick Ids passed in */
    getUnCompleteTicksByIds: state => ArrTicketIds => state.tickList.reduce((arrList, ticket) => {
      ArrTicketIds.forEach((tickId) => {
        if (ticket._id === tickId && ticket.done === false) {
          arrList.push(ticket);
        }
      });
      return arrList;
    }, []),
    /* eslint-enable */


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
