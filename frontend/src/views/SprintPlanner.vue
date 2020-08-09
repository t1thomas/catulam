<template>
  <v-container
    fluid
    class="fill-height"
  >
    <v-row dense>
      <v-col
        cols="8"
      >
        <sprint-list @ticketMove="resolveMove" />
      </v-col>
      <v-col cols="4">
        <task-list @ticketMove="resolveMove" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import SprintList from '@/components/pm/SprintPlan/SprintList.vue';
import TaskList from '@/components/pm/SprintPlan/TaskList.vue';
import { mapActions } from 'vuex';

export default {
  name: 'SprintPlanner',
  components: {
    SprintList,
    TaskList,
  },
  methods: {
    ...mapActions([
      'nUStoryDialogShow',
    ]),
    resolveMove() {
      console.log('wassup');
    },
  },
};
</script>

<style scoped>

</style>
