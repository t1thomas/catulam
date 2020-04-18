<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
      >
        Logout
        <v-icon right>
          mdi-logout-variant
        </v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>

import { mapState } from 'vuex';

export default {
  name: 'LayoutDefault',
  data() {
    return {
      drawer: null,
    };
  },
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
};
</script>

<style>

</style>
