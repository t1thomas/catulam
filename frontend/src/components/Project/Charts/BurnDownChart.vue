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
import moment from 'moment';
import { mapGetters } from 'vuex';
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
    ...mapGetters([
      'getUnDoneTicksBySprint',
      'getAllTicksBySprint',
    ]),
    endDate() {
      return this.sprint.endDate;
    },
    startDate() {
      return this.sprint.startDate;
    },
    arrDays() {
      const arr = [];
      // only generate days if current datetime is ahead of the sprint start date
      if (moment().isAfter(this.startDate)) {
        for (const m = moment(this.startDate); m.diff(this.endDate, 'days') <= 0; m.add(1, 'days')) {
          // only add days upto current datetime
          if (moment().isAfter(m.startOf('day'))) {
            arr.push({
              start: m.startOf('day')
                .unix(),
              end: m.endOf('day')
                .unix(),
            });
          }
        }
      }
      return arr;
    },
    totalDays() {
      const endDate = Vue.$moment(this.endDate);
      const startDate = Vue.$moment(this.startDate);
      return endDate.diff(startDate, 'days') + 1;
    },
    totalHours() {
      return this.getUnDoneTicksBySprint(this.sprint.id)
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
    getIniTotalHrs() {
      const tickets = this.getAllTicksBySprint(this.sprint.id);
      let totalHrs = 0;
      tickets.forEach((tick) => {
        if (tick.commits.length > 0) {
          const reduced = tick.commits
            .reduce((pre, cur) => ((pre.timestamp < cur.timestamp) ? pre : cur));
          totalHrs += reduced.prevHourEstimate;
        } else {
          totalHrs += tick.hourEstimate;
        }
      });
      return totalHrs;
    },
    idealHours() {
      const arr = [];
      const idealHoursPerDay = this.getIniTotalHrs / this.totalDays;
      for (let i = 1; i <= this.totalDays; i += 1) {
        const num = (this.getIniTotalHrs - (idealHoursPerDay * i));
        arr.push(Math.round((num + Number.EPSILON) * 100) / 100);
      }
      return arr;
    },
    burnDown() {
      const data = [];
      this.arrDays.forEach((date, index) => {
        let totalHrs = 0;
        this.getUnDoneTicksBySprint(this.sprint.id).forEach((tick) => {
          // if tick has no commit
          if (tick.commits.length === 0) {
            // add up total hours of tickets without
            totalHrs += tick.hourEstimate;
          } else {
            // filter to find commits between the start and end of curr date
            const filtered = tick.commits
              .filter((comm) => comm.timestamp > date.start && comm.timestamp < date.end);
            switch (true) {
              case filtered.length > 0: {
                // if there are commits in the current date
                // get the LAST commit
                const lastCommit = filtered
                  .reduce((pre, cur) => ((pre.timestamp > cur.timestamp) ? pre : cur));
                totalHrs += lastCommit.newHourEstimate;
                break;
              }
              case index === 0 && filtered.length === 0: {
                // if index is 0 aka it's first day
                // we can only look to find the FIRST commit from future
                const firstCommit = tick.commits
                  .reduce((pre, cur) => ((pre.timestamp < cur.timestamp) ? pre : cur));
                totalHrs += firstCommit.prevHourEstimate;
                break;
              }
              case index === this.arrDays.length - 1 && filtered.length === 0: {
                // if index is on the last day
                // we can only look to find the LAST commit from the past
                const prevCommit = tick.commits.filter((comm) => comm.timestamp < date.start);
                // get the LAST commit from the past
                const prevComLast = prevCommit
                  .reduce((pre, cur) => ((pre.timestamp > cur.timestamp) ? pre : cur));
                totalHrs += prevComLast.newHourEstimate;
                break;
              }
              default: {
                // if we are past the first day
                // then check for future commits
                const nextCommit = tick.commits.filter((comm) => comm.timestamp > date.end);
                if (nextCommit.length > 0) {
                  // if there are future commits, then get the FIRST commit from future
                  const nextComFirst = nextCommit
                    .reduce((pre, cur) => ((pre.timestamp < cur.timestamp) ? pre : cur));
                  totalHrs += nextComFirst.prevHourEstimate;
                } else {
                  // if there are no future commits, then it must be in the past
                  const prevCommit = tick.commits.filter((comm) => comm.timestamp < date.start);
                  // get the LAST commit from the past
                  const prevComLast = prevCommit
                    .reduce((pre, cur) => ((pre.timestamp > cur.timestamp) ? pre : cur));
                  totalHrs += prevComLast.newHourEstimate;
                }
                break;
              }
            }
          }
        });
        data.push(totalHrs);
      });
      return data;
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    print() {
      console.log(this.burnDown);
    },
    loadData() {
      this.chartData = {
        labels: this.dateLabels,
        datasets: [
          {
            label: 'BurnDown',
            data: this.burnDown,
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
