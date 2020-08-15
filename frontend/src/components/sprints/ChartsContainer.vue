<template>
  <v-tab-item>
    <v-row>
      <v-col cols="6">
        <burn-down-chart />
      </v-col>
      <v-col cols="6">
        <ticks-per-user-chart />
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script>
import BurnDownChart from '@/components/sprints/Charts/BurnDownChart.vue';
import TicksPerUserChart from '@/components/sprints/Charts/TicksPerUserChart.vue';

export default {
  name: 'ChartsContainer',
  components: {
    BurnDownChart,
    TicksPerUserChart,
  },
};
</script>

<style scoped>

</style>
