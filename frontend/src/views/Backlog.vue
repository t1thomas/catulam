<template>
  <v-content>
    <UADialog
      v-if="showUADialog"
    />
    <USDialog
      v-if="showUSDialog"
    />
    <DetailsDrawer v-if="showDrawer" />
    <UserStoryRows v-if="loaded" />
    <NTicDialog v-if="showNTicDialog" />
  </v-content>
</template>

<script>
import { mapActions, mapState } from 'vuex';
// import Vue from 'vue';
import UserStoryRows from '../components/backlog/UserStoryRows.vue';
import UADialog from '../components/backlog/Columns/UADialog.vue';
import USDialog from '../components/backlog/Columns/USDialog.vue';
import DetailsDrawer from '../components/backlog/DetailsDrawer.vue';
import NTicDialog from '../components/backlog/NTicDialog.vue';
import gqlQueries from '../graphql/gql-queries';

export default {
  name: 'Backlog',
  components: {
    UserStoryRows,
    UADialog,
    USDialog,
    DetailsDrawer,
    NTicDialog,
  },
  data: () => ({
    loaded: false,
  }),
  computed: {
    ...mapState({
      showUADialog: (state) => state.changeDialog.showUADialog,
      showUSDialog: (state) => state.changeDialog.showUSDialog,
      showNTicDialog: (state) => state.nTicketDialog.show,
      showDrawer: (state) => state.detailsDrawer.show,
    }),
    proId() {
      return this.$route.query.proId;
    },
  },
  async mounted() {
    await this.loadData();
    this.loaded = true;
    this.startSubscription();
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
    startSubscription() {
      const self = this;
      this.$apollo.subscribe({
        query: gqlQueries.SUB_BACKLOG_UPDATE,
        variables: { proId: this.proId },
      }).subscribe({
        async next() {
          await self.loadData();
        },
        error(error) {
          console.error(error);
        },
      });
    },
  },
};
</script>

<style scoped>

</style>
