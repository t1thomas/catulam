import Vue from 'vue';
import Vuex from 'vuex';
import gqlQueries from '../graphql/gql-queries';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    backLogData: [],
    userStories: [],
    sprintList: [],
    tickets: {},
    repoAndBranch: {},
    cardMoved: { removedFrom: undefined, addedTo: undefined },
  },
  mutations: {
    set_repoAndBranch(state, obj) {
      state.repoAndBranch = obj;
    },
    set_issues(state, obj) {
      state.issues = obj;
    },
    set_userStories(state, obj) {
      state.userStories = obj;
    },
    set_tickets(state, obj) {
      Object.assign(state.tickets, obj);
    },
    set_sprintList(state, obj) {
      state.sprintList = obj;
    },
    set_backLogData(state, obj) {
      state.backLogData = obj;
    },
    set_cardRemoved(state, obj) {
      state.cardMoved.removedFrom = obj;
    },
    set_cardAdded(state, obj) {
      state.cardMoved.addedTo = obj;
    },
    clear_CardRemNAdd(state) {
      state.cardMoved.cardRemovedFrom = undefined;
      state.cardMoved.cardAddedTo = undefined;
    },
    // moveCard_StartToSprint(state) {
    //   state.backLogData.forEach((userStory) =>{
    //     userStory.tickets
    //   })
    // }
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
    async fetchUserStories({ commit }) {
      const response = await Vue.$apolloClient.query({
        query: gqlQueries.USWithTickIds,
      });
      const { UserStory } = response.data;
      commit('set_userStories', UserStory);
    },
    async fetchTickets({ commit }) {
      const response = await Vue.$apolloClient.query({
        query: gqlQueries.Tickets,
      });
      const { ticketsAsMap } = response.data;
      commit('set_tickets', ticketsAsMap);
    },
    async fetchSprints({ commit }) {
      const response = await Vue.$apolloClient.query({
        query: gqlQueries.Sprints,
      });
      const { Sprint } = response.data;
      commit('set_sprintList', Sprint);
    },
    async fetchBackLogData({ commit }) {
      const response = await Vue.$apolloClient.query({
        query: gqlQueries.BackLogData,
      });
      const { UserStory } = response.data;
      commit('set_backLogData', UserStory);
      // console.log(UserStory);
    },
    setCardRemoved({ commit }, listConfig) {
      commit('set_cardRemoved', listConfig);
    },
    setCardAdded({ commit }, listConfig) {
      commit('set_cardAdded', listConfig);
    },
    clearCardRemNAdd({ commit }) {
      commit('clear_CardRemNAdd');
    },
    // cardMoveStartToSprint({commit}) {
    //
    // }
  },
  getters: {
    // getTicIdsPerSprint: state => (sprintNo, arrTicketIds) => arrTicketIds
    //   .filter(tickId => state.sprintList[sprintNo - 1].ticketIds.includes(tickId)),
    getIssueType: state => state.issueType,
    getIssues: state => state.issues,
    getTicketById: state => tickId => state.tickets[tickId],
    /* eslint-disable no-underscore-dangle */
    getIssueById: state => issueId => state.issues.filter(issue => issueId === issue._id),
    getCompletedTickIds: state => ArrTicketIds => ArrTicketIds
      .filter(tickId => state.tickets[tickId].done === true),
    getUnCompleteTickIds: state => ArrTicketIds => ArrTicketIds
      .filter(tickId => state.tickets[tickId].done === false),
    /* Retrieve tickets in done vs un-complete state based on array of tick Ids passed in */
    // getRepoNames: state => state.repoAndBranch.reduce((arr, repo) => {
    //   arr.push(repo.name);
    //   return arr;
    // }, []),
    // getRepoBranches: state => repoName => state.repoAndBranch
    //   .filter(repo => repoName === repo.name)
    //   .reduce((arr, repo) => {
    //     (repo.refs.nodes).forEach((branch) => {
    //       const currentDatetime = new Date(branch.target.committedDate);
    // eslint-disable-next-line max-len
    //       const formattedDate = `${currentDatetime.getDate()}-${currentDatetime.getMonth() + 1}-${currentDatetime.getFullYear()} ${currentDatetime.getHours()}:${currentDatetime.getMinutes()}`;
    //       arr.push({
    //         label: branch.name,
    //         lastCommit: formattedDate,
    //         lastCommitFullDate: currentDatetime,
    //         oid: branch.target.oid,
    //         repoId: repo.id,
    //         branchUrl: `${repo.url}/tree/${branch.name}`,
    //       });
    //     });
    //     return arr;
    //   }, []).sort((a, b) => {
    //     /* eslint-disable no-param-reassign, no-nested-ternary */
    //     a = new Date(a.lastCommitFullDate);
    //     b = new Date(b.lastCommitFullDate);
    //     return a > b ? -1 : a < b ? 1 : 0;
    //     /* eslint-enable */
    //   }),
  },
  modules: {
  },
});
