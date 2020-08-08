<template>
  <not-found-card
    v-if="proSprints.length <= 0"
    type="Sprint"
    @createAction="sPlanShow"
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
              Status
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
              <span v-if="sprint.active">
                Active
                <v-badge
                  dot
                  color="#3aaf25"
                  inline
                />
              </span>
              <span v-else>
                In-active
                <v-badge
                  dot
                  color="#ffae4a"
                  inline
                />
              </span>
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
    sPlanShow() {
      this.$router.push({
        path: '/backlog',
        query: { proId: this.currProject.id },
      });
      this.sPlannerShow({ show: true, proId: this.currProject.id });
    },
    sprintNavigation(sprint) {
      this.$router.push({
        path: '/sprint',
        query: { sprintId: sprint.id, proId: this.currProject.id },
      });
    },
  },
};
</script>

<style scoped>

</style>
