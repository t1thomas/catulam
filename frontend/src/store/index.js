import Vue from 'vue';
import Vuex from 'vuex';
import jwtDecode from 'jwt-decode';
import gqlQueries from '../graphql/gql-queries';
import { apolloClient } from '../vue-apollo';

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
    addCommitOverLay: false,
    sBoardTicMove: {
      ticketId: null,
      removedFrom: null,
      addedTo: null,
      evt: null,
    },
    nTicketDialog: {
      show: false,
    },
    nUStoryDialog: {
      show: false,
    },
    sPlanDialog: {
      show: false,
      proId: null,
      project: null,
      sprints: null,
    },
    nSpDialog: false,
    editMemDialog: {
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
    delUSDialog: {
      show: false,
      userStoryId: null,
    },
    detDrawerUStory: {
      show: false,
      userStoryId: null,
    },
    proListTabsModel: 0,
    currentUser: null,
    currentUserTasks: [],
    carouselModelParent: 1,
    backLogData: [],
    sprintBoardData: null,
    allUserList: [],
    refreshTask: null,
    projects: [],
    tickets: [],
    userStories: [],
    sprints: [],
  },
  mutations: {
    set_addCommitOverLay(state, obj) {
      state.addCommitOverLay = obj;
    },
    add_project(state, obj) {
      state.projects = [...state.projects, obj];
    },
    add_ticket(state, obj) {
      state.tickets = [...state.tickets, obj];
    },
    set_projects(state, obj) {
      state.projects = obj;
    },
    set_tickets(state, obj) {
      state.tickets = obj;
    },
    delete_ticket(state, obj) {
      const index = state.tickets.findIndex((tick) => tick.id === obj.id);
      if (index !== -1) {
        console.log('deleting');
        state.tickets.splice(index, 1);
      }
    },
    remove_tic_assignee(state, obj) {
      state.tickets = state.tickets
        .map((tick) => (tick.id === obj.id ? { ...tick, assignee: null } : tick));
    },
    update_tic_assignee(state, obj) {
      state.tickets = state.tickets
        .map((tick) => (tick.id === obj.id ? { ...tick, assignee: obj.assignee } : tick));
    },
    update_tic_comments(state, obj) {
      state.tickets = state.tickets
        .map((tick) => (tick.id === obj.id ? { ...tick, comments: obj.comments } : tick));
    },
    update_tic_commits(state, obj) {
      state.tickets = state.tickets
        .map((tick) => (tick.id === obj.id
          ? { ...tick, commits: obj.commits, hourEstimate: obj.hourEstimate } : tick));
    },
    update_tic_hrs(state, obj) {
      state.tickets = state.tickets
        .map((tick) => (tick.id === obj.id ? { ...tick, hourEstimate: obj.hourEstimate } : tick));
    },
    update_tic_desc(state, obj) {
      state.tickets = state.tickets
        .map((tick) => (tick.id === obj.id ? { ...tick, desc: obj.desc } : tick));
    },
    set_userStories(state, obj) {
      state.userStories = obj;
    },
    set_sprints(state, obj) {
      state.sprints = obj;
    },
    set_proLstTabModel(state, obj) {
      state.proListTabsModel = obj;
    },
    set_nSpDialog(state, obj) {
      state.nSpDialog = obj;
    },
    set_editMemDialog(state, obj) {
      if (obj.show === false) {
        state.editMemDialog.show = obj.show;
        state.editMemDialog.proId = null;
      } else {
        state.editMemDialog.show = obj.show;
        state.editMemDialog.proId = obj.proId;
      }
    },
    set_backLogData(state, obj) {
      if (obj === null) {
        state.backLogData = null;
      } else {
        state.backLogData = { ...obj };
      }
    },
    set_sprintBoardData(state, obj) {
      if (obj === null) {
        state.sprintBoardData = null;
      } else {
        state.sprintBoardData = { ...obj };
      }
    },
    set_currentUserTasks(state, obj) {
      state.currentUserTasks = [...obj];
    },
    set_allUserList(state, obj) {
      state.allUserList = obj;
    },
    set_removedFrom(state, obj) {
      state.removedFrom = obj;
    },
    set_addedTo(state, obj) {
      state.addedTo = obj;
    },
    /* mutations to get data for changeDialog in backlog */
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
    /* ----------------------------------------------------------*/
    /* mutations to get data for change in sprintBoard */
    sBoardSet_evt(state, obj) {
      state.sBoardTicMove.evt = obj;
    },
    sBoardSet_ticketId(state, obj) {
      state.sBoardTicMove.ticketId = obj;
    },
    sBoardSet_removedFrom(state, obj) {
      state.sBoardTicMove.removedFrom = obj;
    },
    sBoardSet_addedTo(state, obj) {
      state.sBoardTicMove.addedTo = obj;
    },
    sBoardSet_clear(state) {
      state.sBoardTicMove.evt = null;
      state.sBoardTicMove.ticketId = null;
      state.sBoardTicMove.removedFrom = null;
      state.sBoardTicMove.addedTo = null;
    },
    /* ----------------------------------------------------------*/
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
    set_currentUser(state, obj) {
      if (obj === null) {
        state.currentUser = null;
      } else {
        state.currentUser = { ...obj };
      }
    },
    set_snackBarShow_false(state) {
      state.snackBar.show = false;
      state.snackBar.message = '';
      state.snackBar.type = '';
    },
    set_snackBarShow(state, obj) {
      console.log(obj.message);
      state.snackBar.message = obj.message;
      state.snackBar.type = obj.type;
      state.snackBar.show = true;
    },
    set_DrawerShow(state, obj) {
      if (obj.show === false) {
        state.detailsDrawer.show = obj.show;
        state.detailsDrawer.ticketId = null;
      } else {
        console.log(obj);
        state.detailsDrawer.show = obj.show;
        state.detailsDrawer.ticketId = obj.ticketId;
      }
    },
    set_DrawShowUStory(state, obj) {
      if (obj.show === false) {
        state.detDrawerUStory.show = obj.show;
        state.detDrawerUStory.userStoryId = null;
      } else {
        state.detDrawerUStory.userStoryId = obj.userStoryId;
        state.detDrawerUStory.show = obj.show;
      }
    },
    set_delUSDialog(state, obj) {
      if (obj.show === false) {
        state.delUSDialog.show = obj.show;
        state.delUSDialog.userStoryId = null;
      } else {
        state.delUSDialog.userStoryId = obj.userStoryId;
        state.delUSDialog.show = obj.show;
      }
    },
    set_sPlanShow(state, obj) {
      if (obj.show === false) {
        state.sPlanDialog.show = obj.show;
        state.sPlanDialog.project = null;
        state.sPlanDialog.sprints = null;
      } else {
        state.sPlanDialog.show = obj.show;
        state.sPlanDialog.project = obj.project;
        state.sPlanDialog.sprints = obj.sprints;
      }
    },
    set_nTicDialogShow(state, obj) {
      if (obj.show === false) {
        state.nTicketDialog.show = obj.show;
      } else {
        state.nTicketDialog.show = obj.show;
      }
    },
    set_nUStoryDialogShow(state, obj) {
      if (obj.show === false) {
        state.nUStoryDialog.show = obj.show;
      } else {
        state.nUStoryDialog.show = obj.show;
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
    set_RefreshTask(state, obj) {
      if (obj === null) {
        state.refreshTask = null;
      } else {
        state.refreshTask = obj;
      }
    },
    set_viewingPro(state, obj) {
      state.currentUser.viewingPro = obj.project.id;
    },
  },
  actions: {
    showAddCommitOverLay({ commit }, obj) {
      commit('set_addCommitOverLay', obj);
    },
    // Projects associated with currentUser
    async fetchProjects({ commit }, payload) {
      await apolloClient.query({
        query: gqlQueries.PROJECTS,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { Project } = response.data;
        console.log(Project);
        if (Project.length > 0) {
          commit('set_projects', Project);
        }
      }).catch((error) => {
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    // All Tickets from projects that currentUser is member of
    async fetchTickets({ commit }, payload) {
      await apolloClient.query({
        query: gqlQueries.TICKETS,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { Ticket } = response.data;
        console.log(Ticket);
        if (Ticket.length > 0) {
          commit('set_tickets', Ticket);
        }
      }).catch((error) => {
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    // set_userStories
    // All UserStories from projects that currentUser is member of
    async fetchUserStories({ commit }, payload) {
      await apolloClient.query({
        query: gqlQueries.USER_STORIES,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { UserStory } = response.data;
        console.log(UserStory);
        if (UserStory.length > 0) {
          commit('set_userStories', UserStory);
        }
      }).catch((error) => {
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    // All UserStories from projects that currentUser is member of
    async fetchSprints({ commit }, payload) {
      await apolloClient.query({
        query: gqlQueries.SPRINTS,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { Sprint } = response.data;
        console.log(Sprint);
        if (Sprint.length > 0) {
          commit('set_sprints', Sprint);
        }
      }).catch((error) => {
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    async getRefreshTokens({ dispatch, commit }) {
      await apolloClient.mutate({
        mutation: gqlQueries.REFRESH_TOKEN,
        fetchPolicy: 'no-cache',
      }).then((response) => {
        const { token } = response.data.refreshAccess;
        // store token in local storage
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(process.env.VUE_APP_AUTH_TOKEN, token);
        }
        // update currentUser State
        dispatch('fetchCurrentUser');
      }).catch((error) => {
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    autoRefresh({ dispatch, commit }) {
      if (typeof localStorage !== 'undefined') {
        // get token stored in localStorage and decode expiry
        const token = localStorage.getItem(process.env.VUE_APP_AUTH_TOKEN);
        const { exp } = jwtDecode(token);
        // get Datetime 15 min before token expiry
        const MinFromExp = Vue.$moment.unix(exp).subtract(15, 'minutes');
        // get current DateTime
        const now = Vue.$moment();
        // Calculate difference in milliseconds
        const diff = MinFromExp.diff(now, 'milliseconds');
        // setTimeout to request for refresh token 15min before exp
        const refreshTask = setTimeout(() => dispatch('getRefreshTokens'), diff);
        // commit task to store, so it can be cleared on logout
        commit('set_RefreshTask', refreshTask);
      }
    },
    showEditMemDialog({ commit }, obj) {
      commit('set_editMemDialog', obj);
    },
    delUSDialogShow({ commit }, payload) {
      commit('set_delUSDialog', payload);
    },
    snackBarOff({ commit }) {
      commit('set_snackBarShow_false');
    },
    snackBarOn({ commit }, payload) {
      commit('set_snackBarShow', payload);
    },
    async fetchSPlannerData({ commit }, id) {
      await apolloClient.query({
        query: gqlQueries.S_PLANNER_DATA,
        fetchPolicy: 'no-cache',
        variables: { id },
      }).then((response) => {
        const { Sprint } = response.data;
        commit('set_sprintList', Sprint);
      }).catch((error) => {
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    async fetchBackLogData({ commit }, id) {
      await apolloClient.query({
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
          commit('set_snackBarShow', {
            message: `Unable to fetch Backlog for project: ${error}`,
            type: 'error',
          });
        });
    },
    async fetchSprintBoardData({ commit }, id) {
      await apolloClient.query({
        query: gqlQueries.SPRINT_BOARD_DATA,
        fetchPolicy: 'no-cache',
        variables: { id },
      })
        .then((response) => {
          const { data } = response;
          if (data === null) {
            throw new Error();
          } else {
            commit('set_sprintBoardData', data);
          }
        })
      // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          commit('set_snackBarShow', 'Unable to fetch Sprint Data project');
        });
    },
    async fetchCurrentUser({ commit, dispatch }) {
      // const inLogin = Vue.$router.currentRoute.name === 'login';
      apolloClient.query({
        query: gqlQueries.CURRENT_USER,
        fetchPolicy: 'no-cache',
      }).then((response) => {
        const { getCurrentUser } = response.data;
        console.log(getCurrentUser);
        commit('set_currentUser', getCurrentUser);
        dispatch('autoRefresh');
      }).catch((error) => {
        commit('set_currentUser', null);
        // only show error message if request was made outside login page
        // if (!inLogin) {
        commit('set_snackBarShow', {
          message: error,
          type: 'error',
        });
        // }
      });
    },
    removeUser({ commit }) {
      // set current user to null
      commit('set_currentUser', null);
      // and force user to login
      if (Vue.$router.currentRoute.name !== 'login') {
        Vue.$router.push('/');
      }
      // and remove invalid access token
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(process.env.VUE_APP_AUTH_TOKEN);
      }
    },
    async logoutUser({ commit }) {
      await apolloClient.mutate({
        mutation: gqlQueries.logout,
        fetchPolicy: 'no-cache',
      }).then(() => {
        commit('set_currentUser', null);
        commit('set_RefreshTask', null);
        // and force user to login
        Vue.$router.push('/');
      }).catch((error) => {
        commit('set_currentUser', null);
        // and force user to login
        Vue.$router.push('/');
        commit('set_snackBarShow', { message: error, type: 'error' });
        // remove timer that requests refresh token
        commit('set_RefreshTask', null);
      });
    },
    async fetchAllUserList({ commit }) {
      await apolloClient.query({
        query: gqlQueries.ALL_USERS,
        fetchPolicy: 'no-cache',
      })
        .then((response) => {
          const { User } = response.data;
          console.log(User);
          commit('set_allUserList', User);
        })
        .catch((error) => {
          // console.log('Unable to fetch Users');
          commit('set_snackBarShow', { message: error, type: 'error' });
        });
    },
    async addTicketComment({ commit }, payload) {
      await apolloClient.mutate({
        mutation: gqlQueries.ADD_TICKET_COMMENT,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { AddTicketComments } = response.data;
        console.log(AddTicketComments);
        commit('update_tic_comments', AddTicketComments);
      }).catch((error) => {
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    async addTicketCommit({ commit }, payload) {
      await apolloClient.mutate({
        mutation: gqlQueries.ADD_TICKET_COMMIT,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { AddTicketCommits } = response.data;
        console.log(AddTicketCommits);
        commit('update_tic_commits', AddTicketCommits);
      }).catch((error) => {
        commit('set_snackBarShow', {
          message: `Unable to add commit: ${error}`,
          type: 'error',
        });
      });
    },
    async updateTicketHours({ commit }, payload) {
      await apolloClient.mutate({
        mutation: gqlQueries.UPDATE_TICKET_ETIME,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { UpdateTicket } = response.data;
        commit('update_tic_hrs', UpdateTicket);
        console.log(UpdateTicket);
      }).catch((error) => {
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    async updateTicketDesc({ commit }, payload) {
      await apolloClient.mutate({
        mutation: gqlQueries.UPDATE_TICKET_DESC,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { UpdateTicket } = response.data;
        commit('update_tic_desc', UpdateTicket);
        console.log(UpdateTicket);
      }).catch((error) => {
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    async updateTicketAssignee({ commit }, payload) {
      await apolloClient.mutate({
        mutation: gqlQueries.UPDATE_TICKET_ASSIGNEE,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { UpdateTicketAssignee } = response.data;
        console.log(UpdateTicketAssignee);
        commit('update_tic_assignee', UpdateTicketAssignee);
      }).catch((error) => {
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    async removeTicketAssignee({ commit }, payload) {
      await apolloClient.mutate({
        mutation: gqlQueries.REMOVE_TICKET_ASSIGNEE,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { RemoveTicketAssignee } = response.data;
        commit('remove_tic_assignee', RemoveTicketAssignee);
      }).catch((error) => {
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    async deleteTicket({ commit }, payload) {
      await apolloClient.mutate({
        mutation: gqlQueries.DELETE_TICKET,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { DeleteTicket } = response.data;
        console.log(DeleteTicket);
        commit('set_DrawerShow', { show: false });
        commit('delete_ticket', DeleteTicket);
      }).catch((error) => {
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    async createProject({ commit }, payload) {
      await apolloClient.mutate({
        mutation: gqlQueries.CREATE_PROJECT,
        variables: payload,
        fetchPolicy: 'no-cache',
      })
        .then((response) => {
          const { CreateProject } = response.data;
          commit('set_DrawerShow', CreateProject);

          commit('add_project', CreateProject);
        })
        .catch((error) => {
          commit('set_snackBarShow', { message: error, type: 'error' });
        });
    },
    async createTicket({ commit }, payload) {
      await apolloClient.mutate({
        mutation: gqlQueries.CREATE_TICKET,
        variables: payload,
        fetchPolicy: 'no-cache',
      })
        .then((response) => {
          const { CreateTicket } = response.data;
          console.log(CreateTicket);
          commit('add_ticket', CreateTicket);
          commit('set_snackBarShow', {
            message: `Created Ticket ${CreateTicket.title} #${CreateTicket.issueNumber} Successfully`,
            type: 'success',
          });
        })
        .catch((error) => {
          commit('set_snackBarShow', {
            message:
              `Unable to Create Ticket: ${error}`,
            type: 'error',
          });
        });
    },
    async updateViewingPro({ commit }, payload) {
      // update local state, regardless
      // of API operation success
      commit('set_viewingPro', payload);
      await apolloClient.mutate({
        mutation: gqlQueries.UPDATE_VIEWING_PRO,
        variables: payload,
        fetchPolicy: 'no-cache',
      }).catch((error) => {
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    async fetchCurrentUserTasks({ commit }, payload) {
      apolloClient.query({
        query: gqlQueries.USER_TASKS,
        variables: payload,
        fetchPolicy: 'no-cache',
      })
        .then((response) => {
          const { projects } = response.data.User[0];
          if (projects.length > 0) {
            commit('set_currentUserTasks', projects.map((pro) => pro.Project));
          }
        })
        .catch((error) => {
          commit('set_snackBarShow', { message: error, type: 'error' });
        });
    },
    async sPlannerShow({ commit }, payload) {
      if (!payload.show) {
        commit('set_sPlanShow', payload);
      } else {
        await apolloClient.query({
          query: gqlQueries.S_PLANNER_DATA,
          fetchPolicy: 'no-cache',
          variables: { id: payload.proId },
        })
          .then((response) => {
            const { Project } = response.data;
            const project = Project[0];
            const sprints = Project[0].sprints.sort((a, b) => a.sprintNo - b.sprintNo);
            commit('set_sPlanShow', { show: true, project, sprints });
          })
          .catch((error) => {
            // console.log('Unable to load Sprint Planner');
            commit('set_snackBarShow', { message: error, type: 'error' });
          });
      }
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
    /* actions to set data for changeDialog in backlog */
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

    /* actions to set data for change in sprintBoard */
    sBoardEvt({ commit }, value) {
      commit('sBoardSet_evt', value);
    },
    sBoardTicketId({ commit }, value) {
      commit('sBoardSet_ticketId', value);
    },
    sBoardRemovedFrom({ commit }, value) {
      commit('sBoardSet_removedFrom', value);
    },
    sBoardAddedTo({ commit }, value) {
      commit('sBoardSet_addedTo', value);
    },
    sBoardClear({ commit }) {
      commit('sBoardSet_clear');
    },
    /* -------------------------------------- */
    detDrawShow({ commit }, val) {
      commit('set_DrawerShow', val);
    },
    detDrawUStoryShow({ commit }, val) {
      commit('set_DrawShowUStory', val);
    },
    nTicDialogShow({ commit }, val) {
      commit('set_nTicDialogShow', val);
    },
    nUStoryDialogShow({ commit }, val) {
      commit('set_nUStoryDialogShow', val);
    },
    nProDialogShow({ commit }, val) {
      commit('set_nProDialog', val);
    },
    onTabChange({ commit }, value) {
      commit('set_proLstTabModel', value);
    },
  },
  getters: {
    getViewingProject: (state) => state.currentUser.viewingPro,
    // construct and return gravatar url with member id
    getGravatar: (state) => (memberId) => {
      const { avatar } = state.allUserList.find((member) => member.id === memberId);
      return `https://gravatar.com/avatar/${avatar}?d=identicon`;
    },
    getFullName: (state) => (memberId) => state.allUserList
      .find((member) => member.id === memberId).fullName,
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
    getMemberById: (state) => (memberId) => state.allUserList
      .find((member) => member.id === memberId),
    getSprintById: (state) => (sprintId) => state.sprints
      .find((sprint) => sprint.id === sprintId),
    // get project members by project ID
    getProjectMembers: (state) => (projectId) => state.projects
      .find((pro) => pro.id === projectId).members
      .map((mem) => ({ id: mem.User.id, role: mem.role })),
    // get project members by project ID
    getProjectTickets: (state) => (projectId) => state.tickets
      .filter((tick) => tick.project.id === projectId),
    getProjectSprints: (state) => (projectId) => state.sprints
      .filter((sp) => sp.project.id === projectId),

    // get completed tickets by user ID and project ID
    getDoneTicksByProMember: (state) => (memberId, projectID) => state.tickets
      .filter((tick) => tick.project.id === projectID && tick.assignee !== null)
      .filter((proTick) => proTick.assignee.id === memberId && proTick.done === true),
    // get unCompleted tickets by user ID and project ID
    getUnDoneTicksByProMember: (state) => (memberId, projectID) => state.tickets
      .filter((tick) => tick.project.id === projectID && tick.assignee !== null)
      .filter((proTick) => proTick.assignee.id === memberId && proTick.done === false),

    // get completed tickets by Sprint ID
    getDoneTicksBySprint: (state) => (sprintID) => state.tickets
      .filter((tick) => tick.sprint.id === sprintID && tick.done === true),
    // get unCompleted tickets by Sprint ID
    getUnDoneTicksBySprint: (state) => (sprintID) => state.tickets
      .filter((tick) => tick.sprint !== null)
      .filter((tick) => tick.sprint.id === sprintID && tick.done === false),
    // get all tickets by Sprint ID
    getAllTicksBySprint: (state) => (sprintID) => state.tickets
      .filter((tick) => tick.sprint !== null)
      .filter((tick) => tick.sprint.id === sprintID),

    getCurrentUser: (state) => state.currentUser,
    getCurrProject: (state) => (proId) => state.projects
      .find((project) => project.id === proId),
    getCurrTick: (state) => state.tickets
      .find((ticket) => ticket.id === state.detailsDrawer.ticketId),
    getTicketById: (state) => (id) => state.tickets
      .find((ticket) => ticket.id === id),
    // get ticket ids that dont have sprints, and have a uStory id that matches param
    getTicksUsNoSp: (state) => (userStoryId) => state.backLogData.UsNoSp
      .filter((tick) => tick.userStory.id === userStoryId)
      .map((tick) => tick.id),
    // get ticket ids that are done, and have a uStory id that matches param
    getDoneTicksUs: (state) => (userStoryId) => state.backLogData.DUS
      .filter((tick) => tick.userStory.id === userStoryId)
      .map((tick) => tick.id),
    // get ticket ids that are done, and have no uStory id
    getDoneTicksNoUs: (state) => state.backLogData.DnoUS
      .map((tick) => tick.id),
    // get ticket ids have a uStory id sprint id that matches params
    getTickIdsPerSprintUS: (state) => (sprintId, userStoryId) => state.backLogData.UsSp
      .filter((tick) => tick.sprint.id === sprintId && tick.userStory.id === userStoryId)
      .map((tick) => tick.id),
    // get ticket ids that dont have sprints, and no a uStory
    getTicksNoUsNoSp: (state) => state.backLogData.noUsNoSp
      .map((tick) => tick.id),
    // get ticket ids without uStory, but sprint id that matches params
    getTickIdsPerSprintNoUS: (state) => (sprintId) => state.backLogData.noUsSp
      .filter((tick) => tick.sprint.id === sprintId)
      .map((tick) => tick.id),
    getUserStoryText: (state) => (userStoryId) => state.userStories
      .find((userStory) => userStory.id === userStoryId).storyText,
    getUserStoryByPro: (state) => (proId) => state.userStories
      .filter((uStory) => uStory.project.id === proId),
    getUserStoryByID: (state) => (uStoryId) => state.userStories
      .find((uStory) => uStory.id === uStoryId),
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
    getPos0Ticks: (state) => state.sprintBoardData.pos0[0].tickets
      .map((tick) => tick.id),
    getPos1Ticks: (state) => state.sprintBoardData.pos1[0].tickets
      .map((tick) => tick.id),
    getPosDoneTicks: (state) => state.sprintBoardData.posDone[0].tickets
      .map((tick) => tick.id),
    getProMemberById: (state) => (memberId) => state.currProElements.members
      .find((member) => member.User.id === memberId).User,
    // get members of current project, apart from currently logged in PM
    getProMembers_ex_pm: (state) => state.currProElements.members
      .filter((member) => member.User.id !== state.currentUser.id),
  },
  modules: {
  },
});
