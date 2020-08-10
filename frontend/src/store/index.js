import Vue from 'vue';
import Vuex from 'vuex';
import jwtDecode from 'jwt-decode';
import { apolloClient } from '@/vue-apollo';
import moment from 'moment';
import gqlQueries from '../graphql/gql-queries';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    backlogTicMove: {
      ticketId: null,
      removedFrom: null,
      addedTo: null,
      evt: null,
    },
    sPlanTicMove: {
      ticketId: null,
      removedFrom: null,
      addedTo: null,
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
    nSpDialog: false,
    showUSDialog: false,
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
    set_uSDialogShow(state, obj) {
      state.showUSDialog = obj;
    },
    set_addCommitOverLay(state, obj) {
      state.addCommitOverLay = obj;
    },
    add_project(state, obj) {
      state.projects = [...state.projects, obj];
    },
    set_projects(state, obj) {
      state.projects = obj;
    },
    set_userStories(state, obj) {
      state.userStories = obj;
    },
    set_sprints(state, obj) {
      state.sprints = obj;
    },
    update_uStory(state, obj) {
      // find index of userStories
      const index = state.userStories.findIndex((uStory) => uStory.id === obj.id);
      if (index !== -1) {
        // if exists update uStory properties at index
        const uStoryFound = state.userStories[index];
        state.userStories[index] = Object.assign(uStoryFound, obj);
      } else {
        // if new uStory, add to array
        state.userStories = [...state.userStories, obj];
      }
    },
    update_ticket(state, obj) {
      // find index of ticket
      const index = state.tickets.findIndex((tick) => tick.id === obj.id);
      if (index !== -1) {
        // if exists update ticket properties at index
        const ticFound = state.tickets[index];
        state.tickets[index] = Object.assign(ticFound, obj);
      } else {
        // if new tick, add to array
        state.tickets = [...state.tickets, obj];
      }
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
    delete_user_story(state, obj) {
      const index = state.userStories.findIndex((uStory) => uStory.id === obj.id);
      if (index !== -1) {
        state.userStories.splice(index, 1);
      }
    },
    set_proLstTabModel(state, obj) {
      state.proListTabsModel = obj;
    },
    set_nSpDialog(state, obj) {
      state.nSpDialog = obj;
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


    /* mutations to get data for backlogTicMove in backlog */
    uSCDSet_evt(state, obj) {
      state.backlogTicMove.evt = obj;
    },
    uSCDSet_ticketId(state, obj) {
      state.backlogTicMove.ticketId = obj;
    },
    uSCDSet_removedFrom(state, obj) {
      state.backlogTicMove.removedFrom = obj;
    },
    uSCDSet_addedTo(state, obj) {
      state.backlogTicMove.addedTo = obj;
    },
    /* ----------------------------------------------------- */
    /* mutations to get data for backlogTicMove in backlog */
    spSet_evt(state, obj) {
      state.sPlanTicMove.evt = obj;
    },
    spSet_ticketId(state, obj) {
      state.sPlanTicMove.ticketId = obj;
    },
    spSet_removedFrom(state, obj) {
      state.sPlanTicMove.removedFrom = obj;
    },
    spSet_addedTo(state, obj) {
      state.sPlanTicMove.addedTo = obj;
    },
    spSet_clear(state) {
      state.sPlanTicMove.evt = null;
      state.sPlanTicMove.ticketId = null;
      state.sPlanTicMove.removedFrom = null;
      state.sPlanTicMove.addedTo = null;
    },
    spSet_switchBack(state) {
      // remove ticket from new list and put back in old list
      const { evt } = state.sPlanTicMove;
      evt.from.insertBefore(evt.to.childNodes[evt.newDraggableIndex],
        evt.from.childNodes[evt.oldDraggableIndex]);
    },
    /* ----------------------------------------------------- */
    /* mutations to clear data for backlogTicMove in backlog */
    backlogSet_clear(state) {
      state.backlogTicMove.evt = null;
      state.backlogTicMove.ticketId = null;
      state.backlogTicMove.removedFrom = null;
      state.backlogTicMove.addedTo = null;
    },
    backlogSet_switchBack(state) {
      // remove ticket from new list and put back in old list
      const { evt } = state.backlogTicMove;
      evt.from.insertBefore(evt.to.childNodes[evt.newDraggableIndex],
        evt.from.childNodes[evt.oldDraggableIndex]);
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
        state.delUSDialog.show = false;
        state.delUSDialog.userStoryId = null;
      } else {
        state.delUSDialog.userStoryId = obj.userStoryId;
        state.delUSDialog.show = obj.show;
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
        const MinFromExp = moment.unix(exp).subtract(15, 'minutes');
        // get current DateTime
        const now = moment();
        // Calculate difference in milliseconds
        const diff = MinFromExp.diff(now, 'milliseconds');
        // setTimeout to request for refresh token 15min before exp
        const refreshTask = setTimeout(() => dispatch('getRefreshTokens'), diff);
        // commit task to store, so it can be cleared on logout
        commit('set_RefreshTask', refreshTask);
      }
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
    deleteTicketByID({ commit }, payload) {
      console.log('deleteTicketByID');
      commit('set_DrawerShow', { show: false });
      commit('delete_ticket', payload);
    },
    deleteUserStoryByID({ commit }, obj) {
      commit('set_delUSDialog', { show: false });
      commit('set_DrawShowUStory', false);
      commit('delete_user_story', obj);
    },
    updateTicketById({ commit }, obj) {
      console.log('updateTicketById');
      commit('update_ticket', obj);
    },
    updateUStoryById({ commit }, obj) {
      console.log('updateUStoryById');
      commit('update_uStory', obj);
    },
    async TicketSwitch({ commit }, payload) {
      await apolloClient.mutate({
        mutation: gqlQueries.TICKET_LOCATION_CHANGE,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then(() => {
        commit('set_uSDialogShow', false);
        commit('backlogSet_clear');
        commit('spSet_clear');
      }).catch((error) => {
        commit('set_uSDialogShow', false);
        commit('backlogSet_switchBack');
        commit('spSet_switchBack');
        // clear everything in backlog set and sp set
        commit('spSet_clear');
        commit('backlogSet_clear');
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    async startToSprint({ commit }, payload) {
      await apolloClient.mutate({
        mutation: gqlQueries.SwitchStartSprint.TIC_ADD_SPRINT,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then(() => {
        commit('backlogSet_clear');
      }).catch((error) => {
        commit('backlogSet_switchBack');
        // clear everything in backlog set
        commit('backlogSet_clear');
        commit('set_snackBarShow', { message: error, type: 'error' });
      });
    },
    async sprintToStart({ commit }, payload) {
      await apolloClient.mutate({
        mutation: gqlQueries.SwitchStartSprint.TIC_REMOVE_SPRINT,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then(() => {
        commit('backlogSet_clear');
      }).catch((error) => {
        commit('backlogSet_switchBack');
        // clear everything in backlog set
        commit('backlogSet_clear');
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
    setCarouselModel({ commit }, value) {
      commit('set_carouselModel', value);
    },
    /* actions to set data for backlogTicMove in backlog */
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
    /* -------------------------------------- */
    /* actions to set data for ticket movement in sprintPlanner */
    spEvt({ commit }, value) {
      commit('spSet_evt', value);
    },
    spTicketId({ commit }, value) {
      commit('spSet_ticketId', value);
    },
    spRemovedFrom({ commit }, value) {
      commit('spSet_removedFrom', value);
    },
    spAddedTo({ commit }, value) {
      commit('spSet_addedTo', value);
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
    uSDialogShow({ commit }, value) {
      commit('set_uSDialogShow', value);
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
    getProjectTicketsNoSp: (state) => (projectId) => state.tickets
      .filter((tick) => tick.project.id === projectId
        && tick.sprint === null),
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
      .filter((tick) => tick.sprint !== null
        && tick.sprint.id === sprintID
        && tick.done === true),
    // get unCompleted tickets by Sprint ID
    getUnDoneTicksBySprint: (state) => (sprintID) => state.tickets
      .filter((tick) => tick.sprint !== null
        && tick.sprint.id === sprintID
        && tick.done === false),
    // get all tickets by Sprint ID
    getAllTicksBySprint: (state) => (sprintID) => state.tickets
      .filter((tick) => tick.sprint !== null
        && tick.sprint.id === sprintID),

    getCurrentUser: (state) => state.currentUser,
    getProject: (state) => (proId) => state.projects
      .find((project) => project.id === proId),
    getCurrTick: (state) => state.tickets
      .find((ticket) => ticket.id === state.detailsDrawer.ticketId),
    getTicketById: (state) => (id) => state.tickets
      .find((ticket) => ticket.id === id),
    // get tickets that dont have sprints, and have a uStory id that matches param
    getTicksUsNoSp: (state) => (userStoryId, proId) => state.tickets
      .filter((tick) => tick.project.id === proId
        && tick.done === false
        && tick.sprint === null
        && tick.userStory !== null
        && tick.userStory.id === userStoryId),
    getTicksNoUsNoSp: (state) => (proId) => state.tickets
      .filter((tick) => tick.project.id === proId
        && tick.done === false
        && tick.sprint === null
        && tick.userStory === null),
    getTicksPerSprintUS: (state) => (sprintId, userStoryId, proId) => state.tickets
      .filter((tick) => tick.project.id === proId
        && tick.done === false
        && tick.sprint !== null
        && tick.userStory !== null
        && tick.sprint.id === sprintId
        && tick.userStory.id === userStoryId),
    getTicksPerSprintNoUS: (state) => (sprintId, proId) => state.tickets
      .filter((tick) => tick.project.id === proId
        && tick.done === false
        && tick.userStory === null
        && tick.sprint !== null
        && tick.sprint.id === sprintId),
    // get tickets that are done, and have a uStory id that matches param
    getDoneTicksUs: (state) => (userStoryId, proId) => state.tickets
      .filter((tick) => tick.project.id === proId
       && tick.done === true
       && tick.userStory !== null
       && tick.userStory.id === userStoryId),
    // get tickets that are done, and have no uStory id
    getDoneTicksNoUs: (state) => (proId) => state.tickets
      .filter((tick) => tick.project.id === proId
        && tick.done === true
        && tick.userStory === null),
    // get ticket ids have a uStory id sprint id that matches params

    // get ticket ids that dont have sprints, and no a uStory

    // get ticket ids without uStory, but sprint id that matches params

    getUserStoryText: (state) => (userStoryId) => state.userStories
      .find((userStory) => userStory.id === userStoryId).storyText,
    // get user story Ids by project Id for each row in backlog
    genUStoryRowsByPro: (state) => (proId) => state.userStories
      .filter((uStory) => uStory.project.id === proId)
      .map((uStory) => uStory.id),
    getUserStoryByID: (state) => (uStoryId) => state.userStories
      .find((uStory) => uStory.id === uStoryId),
    getSprintValues: (state) => state.sprints
      .reduce((arr, currSprint, index) => {
        if (index === 0) {
          arr.push({
            id: 'noId',
            text: 'Add to Todo (no sprint)',
          });
          arr.push({
            id: currSprint.id,
            text: `Sprint ${currSprint.sprintNo}`,
          });
        } else {
          arr.push({
            id: currSprint.id,
            text: `Sprint ${currSprint.sprintNo}`,
          });
        }
        return arr;
      }, []),
    getPos0Ticks: (state) => (sprintId) => state.tickets
      .filter((tick) => tick.sprint !== null
        && tick.done === false
        && tick.sprint.id === sprintId
        && tick.sprintPos === 0)
      .map((tick) => tick.id),
    getPos1Ticks: (state) => (sprintId) => state.tickets
      .filter((tick) => tick.sprint !== null
        && tick.done === false
        && tick.sprint.id === sprintId
        && tick.sprintPos === 1)
      .map((tick) => tick.id),
    getPosDoneTicks: (state) => (sprintId) => state.tickets
      .filter((tick) => tick.sprint !== null
        && tick.done === true
        && tick.sprint.id === sprintId
        && tick.sprintPos === 2)
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
