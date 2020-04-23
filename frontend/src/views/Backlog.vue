<template>
  <v-content>
    <UADialog
      v-if="showUADialog"
    />
    <UserStoryRows v-if="loaded" />
    <!--    <USSwitchDialog v-if="showDialog" />-->
  </v-content>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import UserStoryRows from '../components/backlog/UserStoryRows.vue';
import UADialog from '../components/backlog/Columns/UADialog.vue';

// import USSwitchDialog from '../components/backlog/Columns/Dialog.vue';

export default {
  name: 'Backlog',
  components: {
    UserStoryRows,
    UADialog,
    // USSwitchDialog,
  },
  data: () => ({
    loaded: false,

  }),
  computed: {
    ...mapState([
      'userStories',
      'backLogData',
      'changeDialog',
      'currProElements',
    ]),
    showUADialog() {
      return this.changeDialog.showUADialog;
    },
    proId() {
      return this.$route.query.proId;
    },
  },
  async mounted() {
    await this.fetchBackLogData(this.proId);
    await this.fetchCurrProElements(this.proId);
    this.loaded = true;
  },
  methods: {
    ...mapActions([
      'fetchBackLogData',
      'fetchCurrProElements',
    ]),
  },
};
</script>

<style scoped>

</style>
