<template>
  <v-card
    class="mx-auto"
    max-width="500"
    min-width="500"
    color="#4e3f3f"
  >
    <div class="chart-container d-flex grow flex-wrap pa-0">
      <v-sheet
        class="mx-auto"
        :elevation="6"
        :width="400"
      >
        <line-chart
          v-if="loaded"
          class="main"
          :chart-data="chartData"
          :chart-options="chartOptions"
        />
      </v-sheet>
    </div>

    <v-card-text class="py-0 title">
      Sprint {{ sprint.sprintNo }} - BurnDown
    </v-card-text>

    <v-card-subtitle class="">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr class="font-weight-light">
              <th>
                Total Completed
              </th>
              <th>
                Tickets Remaining
              </th>
              <th>
                Avg. Productivity (hr/day)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style="color: #fffa56">
              <td>{{ percentCompleted }}%</td>
              <td>{{ ticksRemaining }}</td>
              <td>{{ productivity }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-subtitle>
    <v-card-actions>
      <v-btn
        color="primary"
        @click="print"
      >
        Print
      </v-btn>
    </v-card-actions>
  </v-card>
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
      'getDoneTicksBySprint',
    ]),
    endDate() {
      return this.sprint.endDate;
    },
    startDate() {
      return this.sprint.startDate;
    },
    ticksRemaining() {
      return this.getUnDoneTicksBySprint(this.sprint.id).length;
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
        arr.push(num.toFixed(2));
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
    productivity() {
      // get total of initial hours
      const start = this.getIniTotalHrs;
      // get current burnDown
      const burn = this.burnDown;
      // generate array calculate hours worked each day
      const hrsPerDay = burn
        .reduce((arr, currVal, index) => (index > 0 ? [...arr, (burn[index - 1] - currVal)]
          : [...arr, (start - currVal)]),
        []);
      // then reduce average hours worked per day
      const avg = (hrsPerDay.reduce((p, c) => p + c, 0) / hrsPerDay.length).toFixed(2);
      return avg;
    },
    percentCompleted() {
      const totalTicks = this.getAllTicksBySprint(this.sprint.id).length;
      const totalDoneTicks = this.getDoneTicksBySprint(this.sprint.id).length;
      return (100 * totalDoneTicks) / totalTicks;
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    print() {
      console.log(this.productivity);
      const burn = this.burnDown;
      const start = this.getIniTotalHrs;
      // burn.forEach((day, index) => {
      //   if (index > 0) {
      //     start = burn[index - 1];
      //   }
      //   console.log(start - day);
      // });
      // const arr = [];
      // for (let i = 0; i < burn.length; i += 1) {
      //   if (i > 0) {
      //     start = burn[i - 1];
      //   }
      //   arr.push(start - burn[i]);
      // }
      // const calc = arr.reduce((a, b) => a + b, 0) / this.burnDown.length;
      // const hrsPerDay = burn.reduce((arr, currVal, index) => {
      //   if (index > 0) {
      //     start = burn[index - 1];
      //   }
      //   arr.push(start - currVal);
      //   return arr;
      // }, []);

      // eslint-disable-next-line max-len
      const hrssPerDay = burn.reduce((arr, currVal, index) => (index > 0 ? [...arr, (burn[index - 1] - currVal)] : [...arr, (start - currVal)]), []);
      const avgHrsPerDay = hrssPerDay.reduce((a, b) => a + b, 0) / this.burnDown.length;

      console.log(hrssPerDay);
      console.log(avgHrsPerDay);
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
      };
      this.loaded = true;
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  bottom: 1rem;
}
</style>
