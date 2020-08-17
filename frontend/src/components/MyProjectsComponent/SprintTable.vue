<template>
  <not-found-card
    v-if="proSprints.length <= 0"
    type="Sprint"
    @createAction="sPlanNavigation"
  />
  <v-card
    v-else
    flat
  >
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>
              Sprint
            </th>
            <th>
              Tickets
            </th>
            <th>
              Start ~ End
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="sprint in proSprints"
            :key="sprint.id"
            style="cursor: pointer"
            @click="sprintNavigation(sprint)"
          >
            <td>
              Sprint {{ sprint.sprintNo }}
            </td>
            <td>
              {{ getUnDoneTicksBySprint(sprint.id).length }}
            </td>
            <td>
              {{ sprint.startDate }} ~ {{ sprint.endDate }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import NotFoundCard from '../NotFoundCard.vue';

export default {
  name: 'SprintTable',
  components: {
    NotFoundCard,
  },
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      'getUnDoneTicksBySprint',
    ]),
    proSprints() {
      return this.$store.getters.getProjectSprints(this.projectId);
    },
  },
  methods: {
    sPlanNavigation() {
      this.$router.push({
        path: '/sPlanner',
        query: { proId: this.projectId },
      });
      this.updateViewingPro();
      this.$store.dispatch('nSprintDialog', true);
    },
    sprintNavigation(sprint) {
      this.$router.push({
        path: '/sprint',
        query: { sprintId: sprint.id, proId: this.projectId },
      });
      this.updateViewingPro();
    },
    updateViewingPro() {
      this.$store.dispatch('updateViewingPro', { project: { id: this.projectId } });
    },
  },
};
</script>

<style scoped>

</style>
