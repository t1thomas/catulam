<template>
  <v-tab-item>
    <v-row class="fill-height">
      <start-col />
      <doing-col />
      <done-col />
    </v-row>
  </v-tab-item>
</template>

<script>
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
};
</script>

<style scoped>

</style>
