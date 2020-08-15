<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-if="currentUser"
      v-model="drawer"
      app
      permanent
      color="accent"
    >
      <nav-draw-items />
      <template v-slot:append>
        <v-container>
          <v-btn
            block
            @click="logout"
          >
            Logout
          </v-btn>
        </v-container>
      </template>
    </v-navigation-drawer>
    <snackbar />
    <tic-det-drawer />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>

import { mapGetters } from 'vuex';
import gqlQueries from '@/graphql/gql-queries';
import { onLogout } from './vue-apollo';
import snackbar from './components/snackbar.vue';
import navDrawItems from './components/appMain/navDrawItems.vue';
import TicDetailsDrawer from './components/Ticket/drawer component/TicDetailsDrawer.vue';

export default {
  name: 'LayoutDefault',
  components: {
    'tic-det-drawer': TicDetailsDrawer,
    snackbar,
    // eslint-disable-next-line vue/no-unused-components
    navDrawItems,
  },
  data: () => ({
    drawer: true,
    obsTickUpdate: null,
    obstTickDelete: null,
    obsUstoryUpdate: null,
    obsUstoryDelete: null,
    obsMemRemove: null,
    obsMemAdd: null,
    obsSpUpdate: null,
    obsSpDelete: null,
  }),
  computed: {
    ...mapGetters([
      'getViewingProject',
    ]),
    gravatar() {
      return `https://gravatar.com/avatar/${this.currentUser.avatar}?d=identicon`;
    },
    currentUser() {
      return this.$store.getters.getCurrentUser;
    },
    viewingPro() {
      if (this.currentUser) {
        if (this.getViewingProject !== '') {
          return this.getViewingProject;
        }
        return null;
      }
      return null;
    },
  },
  watch: {
    currentUser(val) {
      if (val !== null) {
        this.fetchAppDataSet();
        this.activateProSubscriber();
      }
    },
    viewingPro() {
      this.clearObservers();
      if (this.viewingPro !== null) {
        this.activateSubscribers();
        this.updateRoute();
      }
    },
  },
  async created() {
    await this.$store.dispatch('fetchCurrentUser');
  },
  methods: {
    async fetchAppDataSet() {
      // const payload = { username: this.currentUser.username };
      await this.$store.dispatch('fetchAllUserList');
      await this.$store.dispatch('fetchProjectElements');
    },
    updateRoute() {
      const currrentPage = this.$router.currentRoute.name;
      console.log(currrentPage);
      switch (currrentPage) {
        case 'backlog':
          this.$router.push({
            path: '/backlog',
            query: { proId: this.viewingPro },
          });
          break;
        case 'SprintPlanner':
          this.$router.push({
            path: '/sPlanner',
            query: { proId: this.viewingPro },
          });
          break;
        case 'mManagement':
          this.$router.push({
            path: '/mManagement',
            query: { proId: this.viewingPro },
          });
          break;
        case 'sprint':
          this.$router.push({
            path: '/home',
          });
          break;
        default:
          break;
      }
    },
    clearObservers() {
      this.obsTickUpdate = null;
      this.obstTickDelete = null;
      this.obsUstoryUpdate = null;
      this.obsUstoryDelete = null;
      this.obsSpUpdate = null;
      this.obsSpDelete = null;
    },
    async logout() {
      await onLogout(this.$apollo.provider.defaultClient);
    },
    activateProSubscriber() {
      const self = this;
      this.obsMemAdd = this.$apollo.subscribe({
        query: gqlQueries.SUB_ADD_PRO_MEMBER,
        variables: { user: { id: this.currentUser.id } },
      });
      this.obsMemAdd.subscribe({
        async next() {
          /* re-fetch all Project elements to update state
             because when a user has been added to a project,
            the state should contain info about that project. */
          await self.$store.dispatch('fetchProjectElements');
        },
        error(error) {
          console.log('error obsMemAdd');
          self.$store.dispatch('snackBarOn', {
            message: error,
            type: 'error',
          });
        },
      });
      this.obsMemRemove = this.$apollo.subscribe({
        query: gqlQueries.SUB_MEMBER_REMOVE,
        variables: { user: { id: this.currentUser.id } },
      });
      this.obsMemRemove.subscribe({
        async next() {
          /* re-fetch all Project elements to update state because
           when a user has been removed from a project,
           the state must not contain info about that project. */
          await self.$store.dispatch('fetchProjectElements');
          /* re-fetch current user info, as the currently
          viweingPro may be the project he was just removed from */
          await self.$store.dispatch('fetchCurrentUser');
        },
        error(error) {
          console.log('erorr obsMemRemove');
          self.$store.dispatch('snackBarOn', {
            message: error,
            type: 'error',
          });
        },
      });
    },
    activateSubscribers() {
      const self = this;
      this.obsTickUpdate = this.$apollo.subscribe({
        query: gqlQueries.SUB_TICKET_UPDATE,
        variables: { project: { id: this.getViewingProject } },
      });
      this.obsTickUpdate.subscribe({
        async next(response) {
          const { tickUpdate } = response.data;
          console.log(tickUpdate);
          await self.$store.dispatch('updateTicketById', tickUpdate);
        },
        error(error) {
          console.log('eror here');
          self.$store.dispatch('snackBarOn', {
            message: error,
            type: 'error',
          });
        },
      });

      this.obstTickDelete = this.$apollo.subscribe({
        query: gqlQueries.SUB_TICKET_DELETE,
        variables: { project: { id: this.getViewingProject } },
      });
      this.obstTickDelete.subscribe({
        async next(response) {
          const { tickDelete } = response.data;
          console.log(tickDelete);
          await self.$store.dispatch('deleteTicketByID', tickDelete);
        },
        error(error) {
          console.log('obstTickDelete error');
          self.$store.dispatch('snackBarOn', {
            message: error,
            type: 'error',
          });
        },
      });
      this.obsUstoryUpdate = this.$apollo.subscribe({
        query: gqlQueries.SUB_USTORY_UPDATE,
        variables: { project: { id: this.getViewingProject } },
      });
      this.obsUstoryUpdate.subscribe({
        async next(response) {
          const { uSUpdate } = response.data;
          console.log(uSUpdate);
          await self.$store.dispatch('updateUStoryById', uSUpdate);
        },
        error(error) {
          self.$store.dispatch('snackBarOn', {
            message: error,
            type: 'error',
          });
        },
      });
      this.obsUstoryDelete = this.$apollo.subscribe({
        query: gqlQueries.SUB_USTORY_DELETE,
        variables: { project: { id: this.getViewingProject } },
      });
      this.obsUstoryDelete.subscribe({
        async next(response) {
          const { uSDelete } = response.data;
          console.log(uSDelete);
          await self.$store.dispatch('deleteUserStoryByID', uSDelete);
        },
        error(error) {
          console.log('err');
          self.$store.dispatch('snackBarOn', {
            message: error,
            type: 'error',
          });
        },
      });
      this.obsSpUpdate = this.$apollo.subscribe({
        query: gqlQueries.SUB_SPRINT_UPDATE,
        variables: { project: { id: this.getViewingProject } },
      });
      this.obsSpUpdate.subscribe({
        async next(response) {
          const { spUpdate } = response.data;
          console.log(spUpdate);
          await self.$store.dispatch('updateSprintById', spUpdate);
        },
        error(error) {
          self.$store.dispatch('snackBarOn', {
            message: error,
            type: 'error',
          });
        },
      });
      this.obsSpDelete = this.$apollo.subscribe({
        query: gqlQueries.SUB_SPRINT_DELETE,
        variables: { project: { id: this.getViewingProject } },
      });
      this.obsSpDelete.subscribe({
        async next(response) {
          const { spDelete } = response.data;
          console.log(spDelete);
          await self.$store.dispatch('deleteUserStoryByID', spDelete);
        },
        error(error) {
          console.log('err');
          self.$store.dispatch('snackBarOn', {
            message: error,
            type: 'error',
          });
        },
      });
    },
  },
};
</script>

<style>
  .v-snack__content {
    padding: 0 !important;
  }
  .grid-container-main {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 312px auto;
  }
</style>
