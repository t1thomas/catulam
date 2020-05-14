<template>
  <v-content class="pb-0">
    <tic-det-drawer />
    <uStory-det-drawer />
    <user-story-rows v-if="loaded" />
  </v-content>
</template>

<script>
import { mapActions } from 'vuex';
import UserStoryRows from '../components/backlog/UserStoryRows.vue';
import DetailsDrawer from '../components/Ticket/drawer component/DetailsDrawer.vue';
import DetDrawerUStory from '../components/backlog/UStoryDrawer/DetDrawerUStory.vue';

export default {
  name: 'Backlog',
  components: {
    UserStoryRows,
    'tic-det-drawer': DetailsDrawer,
    'uStory-det-drawer': DetDrawerUStory,
  },
  data: () => ({
    loaded: false,
  }),
  computed: {
    proId() {
      return this.$route.query.proId;
    },
  },
  watch: {
    async proId() {
      this.loaded = false;
      await this.loadData();
      this.loaded = true;
    },
  },
  async mounted() {
    await this.loadData();
    this.loaded = true;
  },
  methods: {
    ...mapActions([
      'fetchBackLogData',
      'fetchCurrProElements',
    ]),
    async loadData() {
      await this.fetchCurrProElements(this.proId);
      await this.fetchBackLogData(this.proId);
    },
  },
};
</script>

<style scoped>

</style>
