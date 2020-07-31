<template>
  <v-content>
    <v-container
      class="fill-height"
      fluid
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          md="6"
        >
          <div
            class="px-5 py-3 white--text"
          >
            HELLO
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <burn-down-chart
            v-for="sprint in getProjectSprints(proId)"
            :key="sprint.id"
            :sprint="sprint"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import { mapGetters } from 'vuex';
import BurnDownChart from '../components/Project/Charts/BurnDownChart.vue';

export default {
  name: 'ProjectPage',
  components: {
    BurnDownChart,
  },
  data: () => ({
    chartData: null,
    totalDays: 10,
    totalHours: 200,
    loaded: false,
  }),
  computed: {
    ...mapGetters([
      'getProjectSprints',
    ]),
    proId() {
      return this.$route.query.proId;
    },
  },
  methods: {
    print() {
      console.log('hi');
    },
  },
};
</script>

<style scoped>

</style>
