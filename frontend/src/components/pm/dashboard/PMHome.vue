<template>
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
        <project-list v-if="projects !== null"/>
      </v-col>
    </v-row>
    <n-pro-dialog v-if="showNProDialog" />
    <s-planner-dialog v-if="showSPlanDialog" />
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import NProDialog from './NProDialog.vue';
import ProjectList from './ProjectList.vue';
import SPlannerDialog from '../SprintPlan/planner dialog/SPlannerDialog.vue';

export default {
  name: 'Home',
  components: {
    NProDialog,
    ProjectList,
    SPlannerDialog,
  },
  computed: {
    ...mapState({
      currUser: (state) => state.currentUser,
      showNProDialog: (state) => state.nProDialog.show,
      showSPlanDialog: (state) => state.sPlanDialog.show,
      projects: (state) => state.currPmProjects,
    }),
  },
  methods: {
    async print() {
      console.log(this.projects);
    },
  },
};
</script>
