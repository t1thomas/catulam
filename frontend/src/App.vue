<template>
  <q-layout view="lHh lpR lFf">
    <q-header
      elevated
      class="glossy"
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
        <q-toolbar-title>
          Caṭulam
        </q-toolbar-title>
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
      bordered
      content-class="bg-grey-2"
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
      leftDrawerOpen: false,
    };
  },
  computed: {
    ...mapState([
      'currentUser',
    ]),
    drawerItems() {
      if (this.currentUser) {
        return [
          { icon: 'mdi-logout-variant', label: 'Sign-out', link: '/' },
          { icon: 'mdi-home', label: 'home', link: '/home' },
        ];
      }
      return [
        { icon: 'mdi-login-variant', label: 'Sign-in', link: '/' },
      ];
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
