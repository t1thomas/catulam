import Vue from 'vue';
import Vuex from 'vuex';
import gqlQueries from '../graphql/gql-queries';
// import router from '../router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
    showDialog: false,
    carouselModelParent: 1,
    backLogData: [],
    // userStories: [],
    sprintList: [],
    tickets: [],
    removedFrom: {},
    addedTo: {},
    // repoAndBranch: {},
    // cardMoved: { removedFrom: undefined, addedTo: undefined },
  },
  mutations: {
    set_removedFrom(state, obj) {
      state.removedFrom = obj;
    },
    set_addedTo(state, obj) {
      state.addedTo = obj;
    },
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
      Vue.set(state, 'sprintList', [...obj]);
    },
    set_backLogData(state, obj) {
      Vue.set(state, 'backLogData', [...obj]);
    },
    set_cardRemoved(state, obj) {
      state.cardMoved.removedFrom = obj;
    },
    set_cardAdded(state, obj) {
      state.cardMoved.addedTo = obj;
    },
    clear_Rem_Add(state) {
      state.removedFrom = undefined;
      state.addedTo = undefined;
    },
    set_carouselModel(state, obj) {
      state.carouselModelParent = obj;
    },
    set_showDialog(state) {
      state.showDialog = !state.showDialog;
    },
    set_currentUser(state, obj) {
      state.currentUser = obj;
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
    async fetchUserStories({ commit }) {
      const response = await Vue.$apolloClient.query({
        query: gqlQueries.USWithTickIds,
        fetchPolicy: 'no-cache',
      });
      const { UserStory } = response.data;
      commit('set_userStories', UserStory);
    },
    async fetchTickets({ commit }) {
      await Vue.$apolloClient.query({
        query: gqlQueries.Tickets,
        fetchPolicy: 'no-cache',
      }).then((response) => {
        const { Ticket } = response.data;
        commit('set_tickets', Ticket);
      }).catch((error) => {
        console.error(error);
      });
    },
    async fetchSprints({ commit }) {
      await Vue.$apolloClient.query({
        query: gqlQueries.Sprints,
        fetchPolicy: 'no-cache',
      }).then((response) => {
        const { Sprint } = response.data;
        commit('set_sprintList', Sprint);
      }).catch((error) => {
        console.error(error);
      });
    },
    async fetchBackLogData({ commit }) {
      await Vue.$apolloClient.query({
        query: gqlQueries.BackLogData,
        fetchPolicy: 'no-cache',
      }).then((response) => {
        const { UserStory } = response.data;
        commit('set_backLogData', UserStory);
      }).catch((error) => {
        console.error(error);
      });
    },
    async fetchCurrentUser({ commit }) {
      await Vue.$apolloClient.query({
        query: gqlQueries.CurrentUser,
        fetchPolicy: 'no-cache',
      }).then((response) => {
        const { getCurrentUser } = response.data;
        commit('set_currentUser', getCurrentUser);
        // eslint-disable-next-line no-unused-vars
      }).catch((error) => {
        console.log('here');
        commit('set_currentUser', null);
        throw new Error(error);
        // console.error(error);
      });
    },

    async logoutUser({ commit }) {
      /* remove token right away, s even if the database
      operation fails the client no longer has a token
       */
      const tokenq = localStorage.getItem('catulam_token');
      localStorage.setItem('catulam_token', '');
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.DeleteToken,
        fetchPolicy: 'no-cache',
        variables: { token: tokenq },
      }).then(() => {
        Vue.$apolloClient.resetStore();
        commit('set_currentUser', null);
        // router.push('/');
      }).catch((error) => {
        console.error(error);
      });
    },
    async resetPass({ commit }, payload) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.RESET_PASS,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        console.log(commit);
        const { resetPassword } = response.data;
        localStorage.setItem('catulam_token', resetPassword.token);
        // router.push('/backlog');
        /* reloads the vue instance causing the created hook at main.js to
           run which in turn sets the current user state
        */
      }).catch((error) => {
        localStorage.setItem('catulam_token', '');
        console.error(error);
      });
    },
    setCardRemoved({ commit }, listConfig) {
      commit('set_cardRemoved', listConfig);
    },
    setCardAdded({ commit }, listConfig) {
      commit('set_cardAdded', listConfig);
    },
    clearRemAdd({ commit }) {
      commit('clear_Rem_Add');
    },
    setCarouselModel({ commit }, value) {
      commit('set_carouselModel', value);
    },
    setRemovedFrom({ commit }, value) {
      commit('set_removedFrom', value);
    },
    setAddedTo({ commit }, value) {
      commit('set_addedTo', value);
    },
    showDialogSwitcher({ commit }) {
      commit('set_showDialog');
    },
    setUser({ commit }, value) {
      commit('set_currentUser', value);
    },
    // cardMoveStartToSprint({commit}) {
    //
    // }
  },
  getters: {
    // getCurrentUser: (state) => state.currentUser,
    // getTicIdsPerSprint: state => (sprintNo, arrTicketIds) => arrTicketIds
    //   .filter(tickId => state.sprintList[sprintNo - 1].ticketIds.includes(tickId)),
    getIssueType: (state) => state.issueType,
    getIssues: (state) => state.issues,
    getTicketById: (state) => (tickId) => state.tickets.find((ticket) => ticket.id === tickId),
    /* eslint-disable no-underscore-dangle */
    getIssueById: (state) => (issueId) => state.issues.filter((issue) => issueId === issue._id),
    // getCompletedTickIds: state => ArrTicketIds => ArrTicketIds
    //   .filter(tickId => state.tickets[tickId].done === true),
    // getUnCompleteTickIds: state => ArrTicketIds => ArrTicketIds
    //   .filter(tickId => state.tickets[tickId].done === false),
    getTicsPerSprint: (state) => (sprintId, userStoryId) => state.sprintList
      .find((sprint) => sprint.id === sprintId).tickets
      .reduce((arr, currTicket) => {
        if (currTicket.userStory.id === userStoryId) {
          arr.push(currTicket.id);
        }
        return arr;
      }, []),
    getUnStagedTicks: (state) => (userStoryId) => state.backLogData
      .find((userStory) => userStory.id === userStoryId).tickets
      .reduce((arr, currTicket) => {
        if (currTicket.done === false && currTicket.sprint === null) {
          arr.push(currTicket.id);
        }
        return arr;
      }, []),
    getCompletedTicks: (state) => (userStoryId) => state.backLogData
      .find((userStory) => userStory.id === userStoryId).tickets
      .reduce((arr, currTicket) => {
        if (currTicket.done === true && currTicket.sprint === null) {
          arr.push(currTicket.id);
        }
        return arr;
      }, []),
    getUserStoryText: (state) => (userStoryId) => state.backLogData
      .find((userStory) => userStory.id === userStoryId)
      .storyText,
    getSprintValues: (state) => state.sprintList
      .reduce((arr, currSprint) => {
        arr.push({ id: currSprint.id, label: `Sprint ${currSprint.sprintNo}` });
        return arr;
      }, []),
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
