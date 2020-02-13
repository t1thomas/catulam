import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    repoAndBranch: {},
  },
  mutations: {
    set_repoAndBranch(state, obj) {
      state.repoAndBranch = obj;
    },
  },
  actions: {
    async fetchRepoAndBranch({ commit }) {
      await Vue.$axios.get('/getRepoInfo')
        .then((response) => {
          commit('set_repoAndBranch', response.data);
          console.log(response.data);
        }, (error) => {
          console.error(error);
        });
    },
  },
  getters: {
    getRepoNames: state => state.repoAndBranch.reduce((arr, repo) => {
      arr.push(repo.name);
      return arr;
    }, []),
    getRepoBranches: state => repoName => state.repoAndBranch
      .filter(repo => repoName === repo.name)
      .reduce((arr, repo) => {
        (repo.refs.nodes).forEach((branch) => {
          const currentDatetime = new Date(branch.target.committedDate);
          const formattedDate = `${currentDatetime.getFullYear()}-${currentDatetime.getMonth() + 1}-${currentDatetime.getDate()} ${currentDatetime.getHours()}:${currentDatetime.getMinutes()}`;
          arr.push({
            label: branch.name,
            lastCommit: formattedDate,
            lastCommitFullDate: currentDatetime,
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
