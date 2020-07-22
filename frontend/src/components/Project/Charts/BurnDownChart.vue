<template>
  <div>
    <line-chart
      v-if="loaded"
      style="background: #ffffff"
      :chart-data="chartData"
      :chart-options="chartOptions"
    />
    <v-btn
      class="primary"
      @click="print"
    >
      Print
    </v-btn>
  </div>
</template>
<script>
import Vue from 'vue';
import LineChart from './vueChartJs/LineChart.vue';

export default {
  name: 'BurnDownChart',
  components: {
    LineChart,
  },
  props: {
    sprint: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    loaded: false,
    chartData: null,
    chartOptions: null,
  }),
  computed: {

    endDate() {
      return this.sprint.endDate;
    },
    startDate() {
      return this.sprint.startDate;
    },
    totalDays() {
      const endDate = Vue.$moment(this.endDate);
      const startDate = Vue.$moment(this.startDate);
      return endDate.diff(startDate, 'days') + 1;
    },
    totalHours() {
      return this.$store.getters.getUnDoneTicksBySprint(this.sprint.id)
        .map((tick) => tick.hourEstimate)
        .reduce((a, b) => a + b, 0);
    },
    dateLabels() {
      const endDate = Vue.$moment(this.endDate);
      let startDate = Vue.$moment(this.startDate);
      const dates = [];
      while (startDate <= endDate) {
        dates.push(startDate.format('MMM DD'));
        startDate = startDate.add(1, 'days');
      }
      return dates;
    },
    idealHours() {
      const arr = [];
      const idealHoursPerDay = this.totalHours / this.totalDays;
      for (let i = 0; i <= this.totalDays - 1; i += 1) {
        const num = (this.totalHours - (idealHoursPerDay * i));
        arr.push(this.roundTo2(num));
      }
      return arr;
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    print() {
      console.log(14 / 12);
      const num = 122 / 225;
      console.log(Math.round((num + Number.EPSILON) * 100) / 100);
    },
    roundTo2(num) {
      return Math.round((num + Number.EPSILON) * 100) / 100;
    },
    loadData() {
      this.chartData = {
        labels: this.dateLabels,
        datasets: [
          {
            label: 'BurnDown',
            data: [16, 12, 9, 2],
            fill: false,
            borderColor: '#EE6868',
            backgroundColor: '#EE6868',
            lineTension: 0,
            hoverBorderWidth: 6,
          },
          {
            label: 'Ideal',
            data: this.idealHours,
            borderColor: '#2e7cb3',
            backgroundColor: '#2e7cb3',
            lineTension: 0,
            borderDash: [5, 5],
            fill: false,
            hoverBorderWidth: 6,
          },
        ],
      };
      this.chartOptions = {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 80,
            fontColor: 'black',
          },
        },
        scales: {
          yAxes: [{
            gridLines: {
              display: false,
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
      };
      this.loaded = true;
    },
  },
};
</script>

<style scoped>

</style>
