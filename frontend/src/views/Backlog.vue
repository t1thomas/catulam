<template>
  <v-container
    class="fill-height d-inline-block"
  >
    <div
      v-if="loaded"
      class="containers"
    >
      <UserStoryRows
        v-for="(story) in backLogData"
        :key="story.id"
        :story="story"
      />
    </div>
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
    ]),
    showDialog() {
      return this.uSChangeDialog.showDialog;
    },
  },
  async mounted() {
    await this.fetchTickets();
    await this.fetchSprints();
    await this.fetchBackLogData();
    this.loaded = true;
  },
  methods: {
    ...mapActions([
      'fetchUserStories',
      'fetchTickets',
      'fetchSprints',
      'fetchBackLogData',
    ]),
  },
};
</script>

<style scoped>
.containers {
  height: 100%;
  display: grid;
  grid-template-rows: auto;
}
</style>
