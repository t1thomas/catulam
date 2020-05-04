<template>
  <v-container
    class="fill-height"
    fluid
  >
    <UADialog
      v-if="showUADialog"
    />
    <USDialog
      v-if="showUSDialog"
    />
    <DetailsDrawer v-if="showDrawer" />
    <UserStoryRows v-if="loaded" />
    <NTicDialog v-if="showNTicDialog" />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import UserStoryRows from '../components/backlog/UserStoryRows.vue';
import UADialog from '../components/backlog/dialogs/UADialog.vue';
import USDialog from '../components/backlog/dialogs/USDialog.vue';
import DetailsDrawer from '../components/Ticket/DetailsDrawer.vue';
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
  watch: {
    async proId() {
      this.loaded = false;
      await this.loadData();
      this.startSubscription();
      this.loaded = true;
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
