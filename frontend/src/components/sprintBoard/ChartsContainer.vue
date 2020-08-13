<template>
  <v-tab-item>
    <v-row>
      <v-col cols="6">
        <burn-down-chart />
      </v-col>
      <v-col cols="6">
        <div>
          Pie
        </div>
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script>
import BurnDownChart from '@/components/sprintBoard/Charts/BurnDownChart.vue';

export default {
  name: 'ChartsContainer',
  components: {
    BurnDownChart,
  },
};
</script>

<style scoped>

</style>
