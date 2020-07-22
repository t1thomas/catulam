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
            color="warning"
            class="px-5 py-3"
          >
            <v-btn
              class="primary"
              @click="print"
            >
              Print
            </v-btn>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
       </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>

export default {
  name: 'ProjectPage',
  data: () => ({
    chartData: null,
    totalDays: 10,
    totalHours: 200,
    loaded: false,
  }),
  computed: {
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
