<template>
  <v-content class="fill-height">
    <details-drawer />
    <sprint-columns v-if="loaded" />
  </v-content>
</template>

<script>
import { mapActions } from 'vuex';
import sprintColumns from '../components/sprintBoard/sprintColumns.vue';
import DetailsDrawer from '../components/Ticket/drawer component/TicDetailsDrawer.vue';

export default {
  name: 'SprintBoard',
  components: {
    sprintColumns,
    DetailsDrawer,
  },
  data: () => ({
    loaded: false,
  }),
  computed: {
    sprintId() {
      return this.$route.query.sprintId;
    },
    proId() {
      return this.$route.query.proId;
    },
  },
  watch: {
    async sprintId() {
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
      'fetchSprintBoardData',
      'fetchCurrProElements',
    ]),
    async loadData() {
      await this.fetchCurrProElements(this.proId);
      await this.fetchSprintBoardData(this.sprintId);
    },
  },
};
</script>

<style scoped>

</style>
