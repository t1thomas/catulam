<template>
  <v-col>
    <v-card style="background-color: #27201f">
      <v-card-title class="py-0">
        To-do
      </v-card-title>
      <v-card-text style="height: 85vh">
        <drag-list
          :list-properties="tickListConfig"
          :ticket-ids="tickIdsPos0"
        />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { mapGetters } from 'vuex';
import DraggableTickListSprint from '../DraggableTickListSprint.vue';

export default {
  name: 'ToDoCol',
  components: {
    'drag-list': DraggableTickListSprint,
  },
  computed: {
    tickListConfig() {
      return {
        columnType: 'to-do',
        disabled: false,
        background: '#08000482',
      };
    },
    ...mapGetters({
      tickIdsPos0: 'getPos0Ticks',
    }),
  },
};
</script>

<style scoped>

</style>
