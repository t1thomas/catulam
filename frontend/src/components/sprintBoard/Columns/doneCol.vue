<template>
  <v-col>
    <v-card style="background: #233308bf">
      <v-card-title class="py-0">
        Done
      </v-card-title>
      <v-card-text style="height: 85vh">
        <drag-list
          :list-properties="tickListConfig"
          :ticket-ids="tickIdsPosDone"
        />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { mapGetters } from 'vuex';
import DraggableTickListSprint from '../DraggableTickListSprint.vue';

export default {
  name: 'DoneCol',
  components: {
    'drag-list': DraggableTickListSprint,
  },
  computed: {
    tickListConfig() {
      return {
        columnType: 'done',
        disabled: false,
        background: '#020e0282',
      };
    },
    ...mapGetters({
      tickIdsPosDone: 'getPosDoneTicks',
    }),
  },
};
</script>

<style scoped>

</style>
