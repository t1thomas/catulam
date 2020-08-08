<template>
  <v-col>
    <v-card style="background: #4e4e109e">
      <v-card-title class="py-0">
        Doing
      </v-card-title>
      <v-card-text style="height: 85vh">
        <drag-list
          :list-properties="tickListConfig"
          :ticket-ids="tickIds"
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
        background: '#171b0582',
      };
    },
    sprintId() {
      return this.$route.query.sprintId;
    },
    tickIds() {
      return this.getPos1Ticks(this.sprintId);
    },
    ...mapGetters([
      'getPos1Ticks',
    ]),
  },
};
</script>

<style scoped>

</style>
