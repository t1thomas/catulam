<template>
  <v-content
    fluid
    class="fill-height pa-1"
  >
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="transparent"
      >
        <h1 class="font-weight-bold heading pl-1">
          Sprint {{ currSprint.sprintNo }} - {{ currPro.label }}
        </h1>
        <v-spacer />
        <v-tab> Sprint Board</v-tab>
        <v-tab> BurnDown</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <sprint-columns />
        <charts-container />
      </v-tabs-items>
    </v-card>
  </v-content>
</template>

<script>
import { mapGetters } from 'vuex';
import ChartsContainer from '@/components/sprintBoard/ChartsContainer.vue';
import sprintColumns from '../components/sprintBoard/sprintColumns.vue';

export default {
  name: 'SprintBoard',
  components: {
    sprintColumns,
    ChartsContainer,
  },
  data: () => ({
    loaded: true,
    tab: null,
  }),
  computed: {
    ...mapGetters([
      'getProject',
      'getSprintById',
      'getProjectSprints',
    ]),
    sprintId() {
      return this.$route.query.sprintId;
    },
    proId() {
      return this.$route.query.proId;
    },
    currPro() {
      return this.getProject(this.proId);
    },
    currSprint() {
      return this.getSprintById(this.sprintId);
    },
  },
};
</script>

<style scoped>

</style>
