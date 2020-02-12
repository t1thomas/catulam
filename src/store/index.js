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
    getRepoNames: state => state.repoAndBranch.forEach(repo => repo.name),
  },
  modules: {
  },
});
