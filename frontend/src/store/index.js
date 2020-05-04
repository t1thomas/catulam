import Vue from 'vue';
import Vuex from 'vuex';
import gqlQueries from '../graphql/gql-queries';
import router from '../router/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    changeDialog: {
      showUSDialog: false,
      showUADialog: false,
      ticketId: null,
      removedFrom: {},
      addedTo: {},
      evt: null,
    },
    nTicketDialog: {
      show: false,
    },
    sPlanDialog: {
      show: false,
      proId: null,
    },
    nProDialog: {
      show: false,
    },
    snackBar: {
      show: false,
      message: '',
      type: '',
    },
    detailsDrawer: {
      show: false,
      ticketId: null,
    },
    currentUser: null,
    currentUserTasks: null,
    carouselModelParent: 1,
    backLogData: [],
    sprintList: [],
    tickets: [],
    routeAuth: false,
    projects: null,
    currentTicket: null,
    currentProject: null,
    currProElements: null,
    allUserList: null,
    currPmProjects: null,
  },
  mutations: {
    set_currPmPros(state, obj) {
      state.currPmProjects = obj;
    },
    set_backLogData(state, obj) {
      if (obj === null) {
        state.backLogData = null;
      } else {
        state.backLogData = { ...obj };
      }
    },
    set_currProElements(state, obj) {
      if (obj === null) {
        state.currProElements = null;
      } else {
        state.currProElements = { ...obj };
      }
    },
    set_currentUserTasks(state, obj) {
      if (obj === null) {
        state.currentUserTasks = null;
      } else {
        state.currentUserTasks = [...obj];
      }
    },
    set_allUserList(state, obj) {
      state.allUserList = obj;
    },
    set_currTickDesc(state, obj) {
      state.currentTicket.desc = obj;
    },
    set_currTickHours(state, obj) {
      state.currentTicket.hourEstimate = obj;
    },
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
    set_projects(state, obj) {
      state.projects = obj;
    },
    set_tickets(state, obj) {
      Object.assign(state.tickets, obj);
    },
    set_sprintList(state, obj) {
      Vue.set(state, 'sprintList', [...obj]);
    },
    /* mutations to manipulate data for changeDialog */
    uSCDSet_evt(state, obj) {
      state.changeDialog.evt = obj;
    },
    uSCDSet_ticketId(state, obj) {
      state.changeDialog.ticketId = obj;
    },
    uSCDSet_removedFrom(state, obj) {
      state.changeDialog.removedFrom = obj;
    },
    uSCDSet_addedTo(state, obj) {
      state.changeDialog.addedTo = obj;
    },
    set_USChangeDialog(state) {
      if (state.changeDialog.showUSDialog === false) {
        state.changeDialog.showUSDialog = true;
      } else {
        state.changeDialog.showUSDialog = false;
        state.changeDialog.removedFrom = undefined;
        state.changeDialog.addedTo = undefined;
        state.changeDialog.evt = null;
        state.changeDialog.ticketId = null;
      }
    },
    set_UAChangeDialog(state) {
      if (state.changeDialog.showUADialog === false) {
        state.changeDialog.showUADialog = true;
      } else {
        state.changeDialog.showUADialog = false;
        state.changeDialog.removedFrom = undefined;
        state.changeDialog.addedTo = undefined;
        state.changeDialog.evt = null;
        state.changeDialog.ticketId = null;
      }
    },
    /* ------------------------------------------------*/
    set_carouselModel(state, obj) {
      state.carouselModelParent = obj;
    },
    set_currTicket(state, obj) {
      state.currentTicket = { ...obj };
    },
    set_currTicket_assignee(state, obj) {
      if (obj === null) {
        state.currentTicket.assignee = null;
      } else {
        state.currentTicket.assignee = { ...obj };
      }
    },
    set_currProject(state, obj) {
      state.currentProject = { ...obj };
    },
    set_currentUser(state, obj) {
      if (obj === null) {
        state.currentUser = null;
      } else {
        state.currentUser = { ...obj };
      }
    },
    set_snackBarShow_false(state) {
      state.snackBar.show = false;
    },
    set_snackBarShow(state, obj) {
      state.snackBar.message = obj.message;
      state.snackBar.type = obj.type;
      state.snackBar.show = true;
    },
    set_DrawerShow(state, obj) {
      if (obj.show === false) {
        state.detailsDrawer.show = obj.show;
        state.detailsDrawer.ticketId = null;
        state.currentTicket = null;
      } else {
        state.detailsDrawer.show = obj.show;
        state.detailsDrawer.ticketId = obj.ticketId;
      }
    },
    set_sPlanShow(state, obj) {
      if (obj.show === false) {
        state.sPlanDialog.show = obj.show;
        state.sPlanDialog.proId = null;
        // state.currentTicket = null;
      } else {
        state.sPlanDialog.show = obj.show;
        state.sPlanDialog.proId = obj.proId;
      }
    },
    set_nTicDialogShow(state, obj) {
      if (obj.show === false) {
        state.nTicketDialog.show = obj.show;
        // state.detailsDrawer.ticketId = null;
        // state.currentTicket = null;
      } else {
        state.nTicketDialog.show = obj.show;
        // state.detailsDrawer.ticketId = obj.ticketId;
      }
    },
    set_nProDialog(state, obj) {
      if (obj.show === false) {
        state.nProDialog.show = obj.show;
        // state.detailsDrawer.ticketId = null;
        // state.currentTicket = null;
      } else {
        state.nProDialog.show = obj.show;
        // state.detailsDrawer.ticketId = obj.ticketId;
      }
    },
    // set_snackBarType(state, obj) {
    //   state.snackBar.type = obj;
    // },
  },
  actions: {
    snackBarOff({ commit }) {
      commit('set_snackBarShow_false');
    },
    snackBarOn({ commit }, payload) {
      commit('set_snackBarShow', payload);
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

    async fetchCurrProElements({ commit }, id) {
      await Vue.$apolloClient.query({
        query: gqlQueries.CURR_PROJECT_ELEMENTS,
        fetchPolicy: 'no-cache',
        variables: { id },
      })
        .then((response) => {
          const { Project } = response.data;
          if (Project === null) {
            throw new Error();
          } else {
            commit('set_currProElements', Project[0]);
          }
        })
        .catch((error) => {
          console.log('Unable to fetch Project');
          console.error(error);
        });
    },
    async fetchBackLogData({ commit }, id) {
      await Vue.$apolloClient.query({
        query: gqlQueries.BACKLOG_DATA,
        fetchPolicy: 'no-cache',
        variables: { id },
      })
        .then((response) => {
          const { data } = response;
          if (data === null) {
            throw new Error();
          } else {
            commit('set_backLogData', data);
          }
        })
        .catch((error) => {
          console.log('Unable to fetch Backlog for project');
          console.error(error);
        });
    },
    async fetchProjects({ commit }) {
      await Vue.$apolloClient.query({
        query: gqlQueries.PROJECTS,
        fetchPolicy: 'no-cache',
      }).then((response) => {
        const { Project } = response.data;
        commit('set_projects', Project);
      }).catch((error) => {
        console.error(error);
      });
    },
    async fetchCurrentUser({ commit }) {
      return Vue.$apolloClient.query({
        query: gqlQueries.CurrentUser,
        fetchPolicy: 'no-cache',
      }).then((response) => {
        const { getCurrentUser } = response.data;
        commit('set_currentUser', getCurrentUser);
        return getCurrentUser;
        // eslint-disable-next-line no-unused-vars
      }).catch((error) => {
        commit('set_currentUser', null);
        console.error(error);
        throw new Error(error);
      });
    },
    async fetchCurrentUserTasks({ commit }, payload) {
      console.log('fetchCurrentUserTasks');
      return Vue.$apolloClient.query({
        query: gqlQueries.USER_TASKS,
        variables: payload,
        fetchPolicy: 'no-cache',
      })
        .then((response) => {
          const { User } = response.data;
          if (User === null) {
            throw new Error();
          } else {
            commit('set_currentUserTasks', User[0].projects.map((pro) => pro.Project));
          }
        })
        .catch((error) => {
          console.log('Unable to fetch User Data');
          console.error(error);
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
        router.push('/');
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
        // don't know if it makes a diffrence
        commit('set_currentUser', null);
      });
    },
    async fetchCurrTicket({ commit }, id) {
      await Vue.$apolloClient.query({
        query: gqlQueries.CURRENT_TICKET,
        fetchPolicy: 'no-cache',
        variables: { id },
      })
        .then((response) => {
          const { Ticket } = response.data;
          if (Ticket === null) {
            throw new Error();
          } else {
            commit('set_currTicket', Ticket[0]);
          }
        })
        .catch((error) => {
          console.log('Unable to fetch Ticket');
          console.error(error);
        });
    },
    async fetchAllUserList({ commit }, id) {
      await Vue.$apolloClient.query({
        query: gqlQueries.ALL_USERS,
        fetchPolicy: 'no-cache',
        variables: { id },
      })
        .then((response) => {
          const { User } = response.data;
          if (User === null) {
            throw new Error();
          } else {
            commit('set_allUserList', User);
          }
        })
        .catch((error) => {
          console.log('Unable to fetch Users');
          console.error(error);
        });
    },
    async fetchCurrProject({ commit }, id) {
      await Vue.$apolloClient.query({
        query: gqlQueries.CURRENT_PROJECT,
        fetchPolicy: 'no-cache',
        variables: { id },
      })
        .then((response) => {
          const { Project } = response.data;
          if (Project === null) {
            throw new Error();
          } else {
            commit('set_currProject', Project[0]);
          }
        })
        .catch((error) => {
          console.log('Unable to fetch Ticket');
          console.error(error);
        });
    },
    async updateTicketHours({ commit }, payload) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.UPDATE_TICKET_ETIME,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { UpdateTicket } = response.data;
        if (UpdateTicket === null) {
          throw new Error('Unable to save changes');
        } else {
          commit('set_currTickHours', UpdateTicket.hourEstimate);
        }
      }).catch((error) => {
        console.error(error);
      });
    },
    async updateTicketAssignee({ commit }, payload) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.UPDATE_TICKET_ASSIGNEE,
        name: 'update',
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { UpdateTicketAssignee } = response.data;
        // Updates the current ticket in DOM
        if (UpdateTicketAssignee === null) {
          commit('set_currTicket_assignee', null);
        } else {
          commit('set_currTicket_assignee', UpdateTicketAssignee);
        }
      }).catch((error) => {
        console.error(error);
      });
    },
    async fetchPmPros({ commit }, payload) {
      await Vue.$apolloClient.query({
        query: gqlQueries.PM_TASKS,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { projects } = response.data.User[0];
        if (projects.length > 0) {
          const data = projects.map((pro) => pro.Project);
          commit('set_currPmPros', data);
        }
      })
        .catch((error) => {
          console.log('User not found');
          console.error(error);
        });
    },
    setCurrTickDesc({ commit }, value) {
      commit('set_currTickDesc', value);
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
    /* actions to set data for changeDialog */
    uSCDEvt({ commit }, value) {
      commit('uSCDSet_evt', value);
    },
    uSCDTicketId({ commit }, value) {
      commit('uSCDSet_ticketId', value);
    },
    uSCDRemovedFrom({ commit }, value) {
      commit('uSCDSet_removedFrom', value);
    },
    uSCDAddedTo({ commit }, value) {
      commit('uSCDSet_addedTo', value);
    },
    setAddedTo({ commit }, value) {
      commit('set_addedTo', value);
    },
    USDialogSwitcher({ commit }) {
      commit('set_USChangeDialog');
    },
    UADialogSwitcher({ commit }) {
      commit('set_UAChangeDialog');
    },
    /* -------------------------------------- */
    detDrawShow({ commit }, val) {
      commit('set_DrawerShow', val);
    },
    sPlannerShow({ commit }, val) {
      commit('set_sPlanShow', val);
    },
    nTicDialogShow({ commit }, val) {
      commit('set_nTicDialogShow', val);
    },
    nProDialogShow({ commit }, val) {
      commit('set_nProDialog', val);
    },
    setUser({ commit }, value) {
      commit('set_currentUser', value);
    },
  },
  getters: {
    // gets users apart from currentUser logged in
    getUserSelection: (state) => (id) => state.allUserList
      .filter((user) => user.id !== id)
      .reduce((arr, currUser) => {
        arr.push({
          id: currUser.id,
          fullName: currUser.fullName,
          avatar: currUser.avatar,
        });
        return arr;
      }, []),
    getStoryById: (state) => (id) => state.currProElements.userStories
      .find((story) => story.id === id),
    getCurrentUser: (state) => state.currentUser,
    // getTicIdsPerSprint: state => (sprintNo, arrTicketIds) => arrTicketIds
    //   .filter(tickId => state.sprintList[sprintNo - 1].ticketIds.includes(tickId)),
    getIssueType: (state) => state.issueType,
    getIssues: (state) => state.issues,
    getTicketById: (state) => (id) => state.currProElements.tickets
      .find((ticket) => ticket.id === id),
    /* eslint-disable no-underscore-dangle */
    getIssueById: (state) => (issueId) => state.issues.filter((issue) => issueId === issue._id),
    // get ticket ids that dont have sprints, and have a uStory id that matches param
    getTicksUsNoSp: (state) => (userStoryId) => state.backLogData.UsNoSp[0].tickets
      .filter((tick) => tick.userStory.id === userStoryId)
      .map((tick) => tick.id),
    // get ticket ids that are done, and have a uStory id that matches param
    getDoneTicksUs: (state) => (userStoryId) => state.backLogData.DUS[0].tickets
      .filter((tick) => tick.userStory.id === userStoryId)
      .map((tick) => tick.id),
    // get ticket ids that are done, and have no uStory id
    getDoneTicksNoUs: (state) => state.backLogData.DnoUS[0].tickets
      .map((tick) => tick.id),
    // get ticket ids have a uStory id sprint id that matches params
    getTickIdsPerSprintUS: (state) => (sprintId, userStoryId) => state.backLogData.UsSp[0].tickets
      .filter((tick) => tick.sprint.id === sprintId && tick.userStory.id === userStoryId)
      .map((tick) => tick.id),
    // get ticket ids that dont have sprints, and no a uStory
    getTicksNoUsNoSp: (state) => state.backLogData.noUsNoSp[0].tickets
      .map((tick) => tick.id),

    // get ticket ids without uStory, but sprint id that matches params
    getTickIdsPerSprintNoUS: (state) => (sprintId) => state.backLogData.noUsSp[0].tickets
      .filter((tick) => tick.sprint.id === sprintId)
      .map((tick) => tick.id),


    getUserStoryText: (state) => (userStoryId) => state.currProElements.userStories
      .find((userStory) => userStory.id === userStoryId).storyText,
    getSprintValues: (state) => state.currProElements.sprints
      .reduce((arr, currSprint, index) => {
        if (index === 0) {
          arr.push({
            value: index,
            id: 'noId',
            text: 'Add to Todo (no sprint)',
          });
          arr.push({
            value: index + 1,
            id: currSprint.id,
            text: `Sprint ${currSprint.sprintNo}`,
          });
        } else {
          arr.push({
            value: index + 1,
            id: currSprint.id,
            text: `Sprint ${currSprint.sprintNo}`,
          });
        }
        return arr;
      }, []),
  },
  modules: {
  },
});
