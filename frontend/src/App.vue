<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      absolute
      clipped
      mini-variant
      expand-on-hover
      color="accent"
    />
    <snackbar />
    <tic-det-drawer />
    <v-content
      class="fill-height"
    >
      <div class="grid-container-main">
        <div>
          <nav-draw-items v-if="currentUser" />
        </div>
        <div>
          <router-view />
        </div>
      </div>
    </v-content>
  </v-app>
</template>

<script>

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
  }),
  computed: {
    gravatar() {
      return `https://gravatar.com/avatar/${this.currentUser.avatar}?d=identicon`;
    },
    currentUser() {
      return this.$store.getters.getCurrentUser;
    },
  },
  watch: {
    async currentUser(val) {
      if (val !== null) {
        const payload = { username: this.currentUser.username };
        console.log(payload);
        await this.$store.dispatch('fetchAllUserList');
        await this.$store.dispatch('fetchProjects', payload);
        await this.$store.dispatch('fetchTickets', payload);
        await this.$store.dispatch('fetchUserStories', payload);
        await this.$store.dispatch('fetchSprints', payload);
      }
    },
  },
  async created() {
    await this.$store.dispatch('fetchCurrentUser');
  },
  methods: {
    async logout() {
      await onLogout(this.$apollo.provider.defaultClient);
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
