<template>
  <v-card
    color="#4e3f3f"
  >
    <v-card-title style="justify-content: center">
      Sprint {{ sprint.sprintNo }} - BurnDown
    </v-card-title>

    <v-card-text>
      <line-chart
        v-if="loaded"
        ref="burnChart"
        class="main"
        :chart-data="chartData"
      />
    </v-card-text>


    <v-card-actions>
      <v-simple-table style="width: 100%">
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
                Avg. Productivity rate (hr/day)
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
    </v-card-actions>
  </v-card>
</template>
<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import LineChart from './vueChartJs/LineChart.vue';

export default {
  name: 'BurnDownChart',
  components: {
    LineChart,
  },
  data: () => ({
    loaded: false,
    chartData: null,
  }),
  computed: {
    ...mapGetters([
      'getUnDoneTicksBySprint',
      'getAllTicksBySprint',
      'getDoneTicksBySprint',
      'getSprintById',
    ]),
    sprintId() {
      return this.$route.query.sprintId;
    },
    sprint() {
      return this.getSprintById(this.sprintId);
    },
    endDate() {
      return this.sprint.endDate;
    },
    startDate() {
      return this.sprint.startDate;
    },
    ticksRemaining() {
      return this.getUnDoneTicksBySprint(this.sprint.id).length;
    },
    /* generates an array of object containing timestamp of
     start of day and end of day for each day in the sprint */
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
      const endDate = moment(this.endDate);
      const startDate = moment(this.startDate);
      return endDate.diff(startDate, 'days') + 1;
    },
    totalHours() {
      return this.getUnDoneTicksBySprint(this.sprint.id)
        .map((tick) => tick.hourEstimate)
        .reduce((a, b) => a + b, 0);
    },
    dateLabels() {
      const endDate = moment(this.endDate);
      let startDate = moment(this.startDate);
      const dates = [];
      while (startDate <= endDate) {
        dates.push(startDate.format('MMM DD'));
        startDate = startDate.add(1, 'days');
      }
      return dates;
    },
    getIniTotalHrs() {
      /* calculate the total hours of all tickets in sprint
       based on initial hour estimate of each ticket */
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
      /* for the number of days in sprint, generate an array of ideal work rate,
         with each element (day) showing the ideal
         number of hours remaining */
      const arr = [];
      // ideal work rate per day
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
        // variable to sum hourEstimate of ticket for every day in arrDays
        let totalHrs = 0;
        // nested loop of tickets
        this.getUnDoneTicksBySprint(this.sprint.id).forEach((tick) => {
          // if tick has no commit
          if (tick.commits.length === 0) {
            // add up total hours of tickets without commits
            totalHrs += tick.hourEstimate;
          } else {
            // filter to find commits between the start and end of CurrDate in arrDays
            const filtered = tick.commits
              .filter((comm) => comm.timestamp > date.start && comm.timestamp < date.end);
            if (filtered.length > 0) {
              // if there are commits in the current date
              // get the LAST commit made that day
              const lastCommit = filtered
                .reduce((pre, cur) => ((pre.timestamp > cur.timestamp) ? pre : cur));
              totalHrs += lastCommit.newHourEstimate;
            } else {
              switch (true) {
                case index === 0: {
                  /* if index is 0 aka it's first day
                   we can only look to find the FIRST commit
                    to obtain ticket's hourEstimate for day 0 */
                  const firstCommit = tick.commits
                    .reduce((pre, cur) => ((pre.timestamp < cur.timestamp) ? pre : cur));
                  totalHrs += firstCommit.prevHourEstimate;
                  break;
                }
                case index === this.arrDays.length - 1: {
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
          }
        });
        // PUSH totalHrs for each day in arrDays
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
      return (hrsPerDay.reduce((p, c) => p + c, 0) / hrsPerDay.length).toFixed(2);
    },
    percentCompleted() {
      const totalTicks = this.getAllTicksBySprint(this.sprint.id).length;
      const totalDoneTicks = this.getDoneTicksBySprint(this.sprint.id).length;
      return (100 * totalDoneTicks) / totalTicks;
    },
  },
  watch: {
    sprintId() {
      this.loadData();
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
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
      this.loaded = true;
    },
  },
};
</script>

<style scoped>

</style>
