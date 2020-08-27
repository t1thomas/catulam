<script>
import { Doughnut, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  name: 'DoughnutChart',
  extends: Doughnut,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    chartOptions: {
      legend: {
        labels: {
          fontColor: 'white',
        },
      },
    },
  }),
  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  },
};
</script>

<style scoped>

</style>
