<template>
  <v-row class="fill-height">
    <start-col />
    <doing-col />
    <done-col />
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
// import gqlQueries from '@/graphql/gql-queries';
import startCol from './Columns/ToDoCol.vue';
import doingCol from './Columns/doingCol.vue';
import doneCol from './Columns/doneCol.vue';

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
  beforeDestroy() {
    console.log('before SprintColumns');
  },
  mounted() {
    // console.log('mounted SprintColumns');
    //
    // const self = this;
    // const obsTickUpdate = this.$apollo.subscribe({
    //   query: gqlQueries.SUB_TICKET_UPDATE,
    //   variables: { project: { id: this.proId } },
    // });
    // obsTickUpdate.subscribe({
    //   async next(response) {
    //     const { tickUpdate } = response.data;
    //     console.log(tickUpdate);
    //     await self.$store.dispatch('updateTicketById', tickUpdate);
    //   },
    //   error(error) {
    //     console.log('eror here');
    //     self.snackBarOn({
    //       message: error,
    //       type: 'error',
    //     });
    //   },
    // });
    // const obstTickDelete = this.$apollo.subscribe({
    //   query: gqlQueries.SUB_TICKET_DELETE,
    //   variables: { project: { id: this.proId } },
    // });
    // obstTickDelete.subscribe({
    //   async next(response) {
    //     const { tickDelete } = response.data;
    //     console.log(tickDelete);
    //     await self.$store.dispatch('deleteTicketByID', tickDelete);
    //   },
    //   error(error) {
    //     console.log('err');
    //     self.snackBarOn({
    //       message: error,
    //       type: 'error',
    //     });
    //   },
    // });
  },
  methods: {
    ...mapActions([
      'snackBarOn',
    ]),
  },
};
</script>

<style scoped>

</style>
