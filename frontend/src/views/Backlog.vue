<template>
  <v-container
    class="fill-height d-inline-block"
  >
    <UserStoryRows v-if="loaded" />
    <!--    <USSwitchDialog v-if="showDialog" />-->
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import UserStoryRows from '../components/backlog/UserStoryRows.vue';
// import USSwitchDialog from '../components/backlog/Columns/Dialog.vue';

export default {
  name: 'Backlog',
  components: {
    UserStoryRows,
    // USSwitchDialog,
  },
  data: () => ({
    loaded: false,

  }),
  computed: {
    ...mapState([
      'userStories',
      'backLogData',
      'uSChangeDialog',
      'currProElements',
    ]),
    showDialog() {
      return this.uSChangeDialog.showDialog;
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
