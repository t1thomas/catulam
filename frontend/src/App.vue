<template>
  <q-layout view="hHh Lpr lff">
    <q-header
      elevated
      class="bg-dark"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-space />
        <q-avatar v-if="currentUser">
          <img
            src="./assets/avatar/scientist.svg"
            alt="avatar"
          >
        </q-avatar>
        <q-btn
          v-if="currentUser"
          flat
          dense
          icon="mdi-logout-variant"
          label="Sign-out"
          @click="logOutHandler"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="slimDrawer"
      mini-to-overlay
      bordered
      content-class="dark2"
      :width="200"
      :breakpoint="500"
      @mouseover="slimDrawer = false"
      @mouseout="slimDrawer = true"
    >
      <q-list>
        <q-item
          v-for="(item, index) in drawerItems"
          :key="index"
          clickable
          tag="a"
          :to="item.link"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-if="currentUser"
          clickable
          tag="a"
          @click="logOutHandler"
        >
          <q-item-section avatar>
            <q-icon name="mdi-logout-variant" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sign-out</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';


import { mapState } from 'vuex';

export default {
  name: 'LayoutDefault',
  data() {
    return {
      leftDrawerOpen: true,
      slimDrawer: true,
    };
  },
  computed: {
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
  watch: {
    currentUser() {
      if (this.currentUser) {
        if (this.$router.currentRoute.path === '/login') {
          this.$router.push('/home');
        }
      }
    },
  },
  methods: {
    async logOutHandler() {
      await this.$store.dispatch('logoutUser');
    },
  },

};
</script>

<style>
  .dark2{
    background: #1a2034;
  }
  .unselectable {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;

    /*
      Introduced in Internet Explorer 10.
      See http://ie.microsoft.com/testdrive/HTML5/msUserSelect/
    */
    -ms-user-select: none;
    user-select: none;
  }
</style>
