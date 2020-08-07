<template>
  <v-content>
    <v-card color="#5c535366">
      <v-card-title
        class="pa-0"
      >
        <toolbar />
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-2">
        <u-story-rows />
      </v-card-text>
    </v-card>
  </v-content>
</template>
<script>
import { mapActions } from 'vuex';
import UStoryRows from '@/components/backlog/UStoryRows.vue';
import gqlQueries from '../../graphql/gql-queries';
import toolbar from './toolbar.vue';

export default {
  name: 'RowContainer',
  components: {
    UStoryRows,
    toolbar,
  },
  computed: {
    proId() {
      return this.$route.query.proId;
    },
  },
  mounted() {
    const self = this;
    const observer = this.$apollo.subscribe({
      query: gqlQueries.SUB_BACKLOG_UPDATE,
      variables: { proId: this.proId },
    });
    observer.subscribe({
      async next() {
        await self.loadData();
        // await self.updateSPlanData();
      },
      error(error) {
        self.snackBarOn({
          message: error,
          type: 'error',
        });
      },
    });
    const observerTickUpdate = this.$apollo.subscribe({
      query: gqlQueries.SUB_TICKET_UPDATE,
      variables: { project: { id: this.proId } },
    });
    observerTickUpdate.subscribe({
      async next(response) {
        const { tickUpdate } = response.data;
        console.log(tickUpdate);
        await self.$store.dispatch('updateTicketById', tickUpdate);
      },
      error(error) {
        console.log('eror here');
        self.snackBarOn({
          message: error,
          type: 'error',
        });
      },
    });
    const obsUstoryUpdate = this.$apollo.subscribe({
      query: gqlQueries.SUB_USTORY_UPDATE,
      variables: { project: { id: this.proId } },
    });
    obsUstoryUpdate.subscribe({
      async next(response) {
        const { uSUpdate } = response.data;
        console.log(uSUpdate);
        await self.$store.dispatch('updateUStoryById', uSUpdate);
      },
      error(error) {
        self.snackBarOn({
          message: error,
          type: 'error',
        });
      },
    });
    const obsUstoryDelete = this.$apollo.subscribe({
      query: gqlQueries.SUB_USTORY_DELETE,
      variables: { project: { id: this.proId } },
    });
    obsUstoryDelete.subscribe({
      async next(response) {
        const { uSDelete } = response.data;
        console.log(uSDelete);
        await self.$store.dispatch('deleteUserStoryByID', uSDelete);
      },
      error(error) {
        self.snackBarOn({
          message: error,
          type: 'error',
        });
      },
    });
  },
  methods: {
    ...mapActions([
      'fetchBackLogData',
      'snackBarOn',
    ]),
    async loadData() {
      await this.fetchBackLogData(this.proId);
    },
    // async updateSPlanData() {
    //   // only request update if sprint planner is currently in view
    //   if (this.showSPlanDialog) {
    //     await this.sPlannerShow({ show: true, proId: this.proId });
    //   }
    // },
  },
};
</script>

<style scoped>

</style>
