<template>
  <v-container>
    <v-row
      dense
    >
      <v-col
        cols="8"
      >
        <sprint-list />
      </v-col>
      <v-col cols="4">
        <task-list />
      </v-col>
    </v-row>
    <n-sp-dialog />
  </v-container>
</template>
<script>
import SprintList from '@/components/SprintPlan/SprintList.vue';
import TaskList from '@/components/SprintPlan/TaskList.vue';
import NSpDialog from '@/components/SprintPlan/NSpDialog.vue';
import { mapState } from 'vuex';

export default {
  name: 'SprintPlanner',
  components: {
    SprintList,
    TaskList,
    NSpDialog,
  },
  computed: {
    ...mapState({
      evt: (state) => state.sPlanTicMove.evt,
      ticketId: (state) => state.sPlanTicMove.ticketId,
      removedFrom: (state) => state.sPlanTicMove.removedFrom,
      addedTo: (state) => state.sPlanTicMove.addedTo,
    }),
    proId() {
      return this.$route.query.proId;
    },
  },
  watch: {
    evt() {
      if (this.evt !== null) {
        this.resolveMove();
      }
    },
  },
  methods: {
    async resolveMove() {
      const payload = {};
      payload.project = { id: this.proId };
      payload.tick = { id: this.ticketId };
      if (this.removedFrom !== null || this.addedTo !== null) {
        switch (true) {
          case this.removedFrom.sprintId === 'noSprint':
            payload.sprintAdd = { id: this.addedTo.sprintId };
            break;
          case this.addedTo.sprintId === 'noSprint':
            payload.sprintRemove = { id: this.removedFrom.sprintId };
            break;
          default:
            payload.sprintAdd = { id: this.addedTo.sprintId };
            payload.sprintRemove = { id: this.removedFrom.sprintId };
            break;
        }
        await this.$store.dispatch('TicketSwitch', payload);
      }
    },
  },
};
</script>

<style scoped>

</style>
