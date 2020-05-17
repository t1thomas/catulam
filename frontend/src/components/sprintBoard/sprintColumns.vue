<template>
  <v-row class="fill-height">
    <start-col />
    <doing-col />
    <done-col />
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import startCol from './Columns/ToDoCol.vue';
import doingCol from './Columns/doingCol.vue';
import doneCol from './Columns/doneCol.vue';
import gqlQueries from '../../graphql/gql-queries';

export default {
  name: 'SprintColumns',
  components: {
    startCol,
    doingCol,
    doneCol,
  },
  computed: {
    proId() {
      return this.$route.query.proId;
    },
    sprintId() {
      return this.$route.query.sprintId;
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
      },
      error(error) {
        this.snackBarOn({
          message: error,
          type: 'error',
        });
      },
    });
  },
  methods: {
    ...mapActions([
      'fetchSprintBoardData',
      'fetchCurrProElements',
      'snackBarOn',
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
