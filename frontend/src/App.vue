<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      mini-variant
      expand-on-hover
    >
      <nav-draw-items />
    </v-navigation-drawer>
    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
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
        color="secondary"
        @click="logout"
      >
        Logout
        <v-icon right>
          mdi-logout-variant
        </v-icon>
      </v-btn>
    </v-app-bar>
    <snackbar />
    <v-container
      fill-height
      fluid
    >
      <router-view />
    </v-container>
  </v-app>
</template>

<script>

import { mapState, mapActions } from 'vuex';
import snackbar from './components/snackbar.vue';
import navDrawItems from './components/appMain/navDrawItems.vue';

export default {
  name: 'LayoutDefault',
  components: {
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
    ...mapState([
      'currentUser',
    ]),
    fullName() {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    },
    drawerItems() {
      if (this.currentUser) {
        return [
          { icon: 'mdi-home', label: 'home', link: '/home' },
          { icon: 'mdi-math-log', label: 'Backlog', link: '/backlog' },
        ];
      }
      return [
        { icon: 'mdi-login-variant', label: 'Sign-in', link: '/' },
      ];
    },
  },
  created() {
    this.$store.dispatch('fetchCurrentUser')
      .catch((e) => {
        console.error(e);
      });
    this.$vuetify.theme.dark = true;
  },
  async beforeUpdate() {
    if (this.currentUser) {
      if (this.currentUser.type === 'pm') {
        await this.fetchPmPros({ username: this.currentUser.username });
      } else if (this.currentUser.type === 'dev') {
        await this.fetchCurrentUserTasks({ username: this.currentUser.username });
      }
      await this.fetchAllUserList();
    }
  },
  methods: {
    ...mapActions([
      'fetchAllUserList',
      'fetchCurrentUserTasks',
      'logoutUser',
      'fetchPmPros',
    ]),
    async logout() {
      await this.logoutUser();
    },
  },
};
</script>

<style>
  .v-snack__content {
    padding: 0 !important;
  }
</style>
