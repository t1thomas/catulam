<template>
  <v-row class="fill-height">
    <start-col />
    <doing-col />
    <done-col />
  </v-row>
</template>

<script>
import startCol from './Columns/startCol.vue';
import doingCol from './Columns/doingCol.vue';
import doneCol from './Columns/doneCol.vue';

export default {
  name: 'SprintColumns',
  components: {
    startCol,
    doingCol,
    doneCol,
  },
};
</script>

<style scoped>

</style>
