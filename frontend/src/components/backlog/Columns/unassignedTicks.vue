<template>
  <v-card style="height: 81vh; max-height: 82vh">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="subtitle-2">
          Unassigned Tickets
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <draggable-tick-list
      :ticket-ids="tickIds"
      :list-properties="tickListConfig"
    />
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import DraggableTickList from '../DraggableTickList.vue';

export default {
  name: 'UnassignedTickets',
  components: {
    DraggableTickList,
  },
  computed: {
    ...mapState({
      unAsTicks: (state) => state.backLogData.tickets,
    }),
    tickListConfig() {
      return { userStoryId: null, columnType: 'Unassigned', disabled: false };
    },
    tickIds() {
      return this.unAsTicks.map((tick) => tick.id);
    },
  },
};
</script>

<style scoped>

</style>
