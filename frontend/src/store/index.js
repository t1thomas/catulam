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
  },
  mutations: {
    set_backLogData(state, obj) {
      if (obj === null) {
        state.backLogData = null;
      } else {
        state.backLogData = { ...obj };
      }
      // Vue.set(state, 'backLogData', [...obj]);
    },
    set_currProElements(state, obj) {
      if (obj === null) {
        state.currProElements = null;
      } else {
        state.currProElements = { ...obj };
      }
      // Vue.set(state, 'backLogData', [...obj]);
    },
    set_currentUserTasks(state, obj) {
      if (obj === null) {
        state.currentUserTasks = null;
      } else {
        state.currentUserTasks = { ...obj };
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
          const { Project } = response.data;
          if (Project === null) {
            throw new Error();
          } else {
            commit('set_backLogData', Project[0]);
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
        throw new Error(error);
      });
    },
    async fetchCurrentUserTasks({ commit }, payload) {
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
            commit('set_currentUserTasks', User[0]);
          }
        })
        .catch((error) => {
          console.log('Unable to fetch User Tasks');
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
      console.log(id);
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
    async addUserTicket({ commit }, payload) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.ADD_USER_TICKET,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { AddUserTickets } = response.data;
        commit('set_currTicket_assignee', AddUserTickets.from);
      }).catch((error) => {
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
    async removeUserTicket({ commit }, payload) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.REM_USER_TICKET,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { RemoveUserTickets } = response.data;
        if (RemoveUserTickets === null) {
          throw new Error('Unable to update Assignee');
        } else {
          commit('set_currTicket_assignee', null);
        }
      }).catch((error) => {
        console.error(error);
      });
    },
    async updateUserTicket({ commit }, payload) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.UPDATE_USER_TICKET,
        fetchPolicy: 'no-cache',
        variables: payload,
      }).then((response) => {
        const { AddUserTickets } = response.data;
        commit('set_currTicket_assignee', AddUserTickets.from);
      }).catch((error) => {
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
    nTicDialogShow({ commit }, val) {
      commit('set_nTicDialogShow', val);
    },
    setUser({ commit }, value) {
      commit('set_currentUser', value);
    },
    // cardMoveStartToSprint({commit}) {
    //
    // }
  },
  getters: {
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
    // getCompletedTickIds: state => ArrTicketIds => ArrTicketIds
    //   .filter(tickId => state.tickets[tickId].done === true),
    // getUnCompleteTickIds: state => ArrTicketIds => ArrTicketIds
    //   .filter(tickId => state.tickets[tickId].done === false),
    getTicsPerSprint: (state) => (sprintId, userStoryId) => state.backLogData.userStories
      .find((story) => story.id === userStoryId).tickets
      .reduce((arr, currTicket) => {
        if (currTicket.sprint !== null) {
          if (currTicket.sprint.id === sprintId) {
            arr.push(currTicket.id);
          }
        }
        return arr;
      }, []),
    getUnStagedTicks: (state) => (userStoryId) => state.backLogData.userStories
      .find((userStory) => userStory.id === userStoryId).tickets
      .reduce((arr, currTicket) => {
        if (currTicket.done === false && currTicket.sprint === null) {
          arr.push(currTicket.id);
        }
        return arr;
      }, []),
    getCompletedTicks: (state) => (userStoryId) => state.backLogData.userStories
      .find((userStory) => userStory.id === userStoryId).tickets
      .reduce((arr, currTicket) => {
        if (currTicket.done === true && currTicket.sprint === null) {
          arr.push(currTicket.id);
        }
        return arr;
      }, []),
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
