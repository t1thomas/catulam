<template>
  <v-card
    color="#4e3f3f"
  >
    <v-card-title
      style="justify-content: center"
    >
      Sprint {{ sprint.sprintNo }} - Tickets Per User
    </v-card-title>

    <v-card-text>
      <doughnut-chart
        v-if="loaded"
        ref="burnChart"
        class="main"
        :chart-data="genChartData"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import DoughnutChart from '@/components/sprints/Charts/vueChartJs/DoughnutChart.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'TicktetsPerUserChart',
  components: {
    DoughnutChart,
  },
  data: () => ({
    loaded: false,
    chartData: null,
  }),
  computed: {
    ...mapGetters([
      'getAllTicksBySprint',
      'getProjectMembers',
      'getSprintById',
    ]),
    proId() {
      return this.$route.query.proId;
    },
    sprintId() {
      return this.$route.query.sprintId;
    },
    proMembers() {
      return this.getProjectMembers(this.proId);
    },
    labels() {
      const arr = this.proMembers.map((user) => user.fullName);
      arr.push('Unassigned Tickets');
      return arr;
    },
    sprint() {
      return this.getSprintById(this.sprintId);
    },
    sprintTickets() {
      return this.getAllTicksBySprint(this.sprintId);
    },
    genChartData() {
      const chartData = {
        datasets: [{ data: [], backgroundColor: [] }],
        labels: [],
      };
      this.proMembers.forEach((currUser) => {
        const ticks = this.sprintTickets
          .filter((tick) => tick.assignee !== null && tick.assignee.id === currUser.id);
        chartData.datasets[0].data.push(ticks.length);
        chartData.datasets[0].backgroundColor.push(this.getRandomColor());
        chartData.labels.push(currUser.fullName);
      });
      const unAssignedTicks = this.sprintTickets
        .filter((tick) => tick.assignee === null);
      chartData.datasets[0].data.push(unAssignedTicks.length);
      chartData.datasets[0].backgroundColor.push(this.getRandomColor());
      chartData.labels.push('Unassigned Tickets');
      return chartData;
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.chartData = this.genChartData;
      this.loaded = true;
    },
    getRandomColor() {
      return `#${(`${Math.random().toString(16)}0000000`).slice(2, 8)}`;
    },
  },
};
</script>

<style scoped>

</style>
