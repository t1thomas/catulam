<template>
  <v-col>
    <v-card>
      <v-card-title class="py-0">
        Doing
      </v-card-title>
      <v-card-text style="height: 85vh">
        <drag-list
          :list-properties="tickListConfig"
          :ticket-ids="tickIdsPos1"
        />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { mapGetters } from 'vuex';
import DraggableTickListSprint from '../DraggableTickListSprint.vue';

export default {
  name: 'DoingCol',
  components: {
    'drag-list': DraggableTickListSprint,
  },
  computed: {
    tickListConfig() {
      return {
        columnType: 'doing',
        disabled: false,
      };
    },
    ...mapGetters({
      tickIdsPos1: 'getPos1Ticks',
    }),
  },
};
</script>

<style scoped>

</style>
