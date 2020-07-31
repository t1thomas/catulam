<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      mini-variant
      expand-on-hover
    >
      <nav-draw-items v-if="currentUser" />
    </v-navigation-drawer>
    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Caṭulam</v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="currentUser"
        class="ma-2"
        text
        icon
        color="red lighten-2"
      >
        <v-avatar
          size="30"
        >
          <img
            :src="gravatar"
            alt="John"
          >
        </v-avatar>
      </v-btn>
      <v-btn
        v-if="currentUser"
        dark
        color="accent"
        @click="logout"
      >
        Logout
        <v-icon right>
          mdi-logout-variant
        </v-icon>
      </v-btn>
    </v-app-bar>
    <snackbar />
    <tic-det-drawer />
    <v-container
      fill-height
      fluid
    >
      <router-view />
    </v-container>
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

 div.v-tabs.elevation-2.cmns-cmis.v-tabs--centered.v-tabs--grow.theme--dark {
   display: grid;
   height: 100%;
   overflow: hidden;
   grid-auto-rows: minmax(48px, auto);
 }
  div.v-tabs.elevation-2.cmns-cmis.v-tabs--centered.v-tabs--grow.theme--dark
  > div.v-window.v-item-group.theme--dark.v-tabs-items > .v-window__container {
    height: 100%;
  }
  div.v-tabs.elevation-2.cmns-cmis.v-tabs--centered.v-tabs--grow.theme--dark >
  div.v-window.v-item-group.theme--dark.v-tabs-items >
  div > div.v-window-item.v-window-item--active{
    height: inherit;
  }
</style>
