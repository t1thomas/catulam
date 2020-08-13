<script>
import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  name: 'LineChart',
  extends: Line,
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
        display: false,
        position: 'top',
        labels: {
          boxWidth: 80,
          fontColor: '#ff9800',
        },
      },
      scales: {
        yAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            fontColor: 'white',
          },
        },
        ],
        xAxes: [{
          ticks: {
            fontColor: 'white',
          },
          gridLines: {
            zeroLineColor: 'white',
            color: 'white',
          },
        }],
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label(tooltipItems, data) {
            return `${data.datasets[tooltipItems.datasetIndex].label}: ${tooltipItems.yLabel}hrs`;
          },
        },
      },
      hover: {
        mode: 'index',
        intersect: false,
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
