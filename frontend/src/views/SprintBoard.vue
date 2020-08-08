<template>
  <v-container
    fluid
    class="fill-height"
  >
    <sprint-columns v-if="loaded" />
  </v-container>
</template>

<script>
import sprintColumns from '../components/sprintBoard/sprintColumns.vue';

export default {
  name: 'SprintBoard',
  components: {
    sprintColumns,
  },
  data: () => ({
    loaded: true,
  }),
  computed: {
    sprintId() {
      return this.$route.query.sprintId;
    },
    proId() {
      return this.$route.query.proId;
    },
  },
  watch: {
    async sprintId() {
      this.loaded = false;
      this.loaded = true;
    },
  },
  beforeDestroy() {
    console.log('beforeSprintBoard');
  },
  async mounted() {
    console.log('mountedSprintBoard');
  },
};
</script>

<style scoped>

</style>
