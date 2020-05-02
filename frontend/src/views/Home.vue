<template>
  <v-content>
    <DevHome v-if="userType==='dev'"/>
    <PMHome v-if="userType==='pm'"/>
  </v-content>
</template>

<script>
import { mapGetters } from 'vuex';
import DevHome from '../components/dev/dashboard/DevHome.vue';
import PMHome from '../components/pm/dashboard/PMHome.vue';

export default {
  name: 'Home',
  components: {
    DevHome,
    PMHome,
  },
  computed: {
    ...mapGetters([
      'getCurrentUser',
    ]),
    userType() {
      return this.getCurrentUser.type;
    },
  },
  mounted() {
    if (this.getCurrentUser === null) {
      this.$router.push('/');
    }
  },
};
</script>
