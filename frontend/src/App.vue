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

import { mapActions, mapGetters, mapState } from 'vuex';
import { onLogout } from './vue-apollo';
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
    ...mapState({
      currentUser: 'currentUser',
      jwt: 'jwt',
    }),
    ...mapGetters([
      'getJwt',
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
  watch: {
    async getJwt(value) {
      if (value.exp !== null && value.token !== null) {
        console.log('fetch user when we get JWT');
        await this.$store.dispatch('fetchCurrentUser');
      }
    },
  },
  async created() {
    this.$vuetify.theme.dark = true;
    await this.fetchUser();
    // await this.$store.dispatch('fetchCurrentUser')
    //   .catch((e) => {
    //     this.snackBarOn({
    //       message: e,
    //       type: 'error',
    //     });
    //   });
    // console.log(this.currentUser);
  },
  methods: {
    ...mapActions([
      'fetchAllUserList',
      'fetchCurrentUserTasks',
      'logoutUser',
      'fetchPmPros',
      'snackBarOn',
    ]),
    async logout() {
      await onLogout(this.$apollo.provider.defaultClient);
    },
    async fetchUser() {
      await this.$store.dispatch('fetchCurrentUser');
      if (this.currentUser !== null) {
        if (this.currentUser.role === 'pm') {
          await this.fetchPmPros({ username: this.currentUser.username });
        } else if (this.currentUser.role === 'dev') {
          await this.fetchCurrentUserTasks({ username: this.currentUser.username });
        }
        await this.fetchAllUserList();
      }
    },
  },
};
</script>

<style>
  .v-snack__content {
    padding: 0 !important;
  }
</style>
