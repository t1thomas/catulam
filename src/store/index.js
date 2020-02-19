import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
