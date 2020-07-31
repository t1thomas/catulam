<template>
  <v-container>
    <v-tabs
      v-model="tab"
      dark
    >
      <v-tab
        v-for="project in projects"
        :key="project.id"
      >
        {{ project.label }}
        <v-badge
          v-if="tasksTotal(project.id) > 0"
          inline
          :content="tasksTotal(project.id)"
        />
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="project in projects"
        :key="project.id"
      >
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  type
                </th>
                <th class="text-left">
                  issueNo
                </th>
                <th class="text-left">
                  Summary
                </th>
                <th class="text-left">
                  Estimate (hrs)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="ticket in project.tickets"
                :key="ticket.id"
                style="cursor: pointer"
                @click="navigation(ticket.id, project.id)"
              >
                <td>
                  <v-icon
                    color="myBlue"
                  >
                    mdi-ticket-confirmation
                  </v-icon>
                </td>
                <td># {{ ticket.issueNumber }}</td>
                <td>{{ ticket.title }}</td>
                <td>{{ ticket.hourEstimate }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ProjectTabs',
  data: () => ({
    tab: null,
  }),
  computed: {
    ...mapState({
      currUser: 'currentUser',
      projects: 'currentUserTasks',
    }),
  },
  methods: {
    tasksTotal(id) {
      // find task with correct project Id
      const currProject = this.projects.find((project) => project.id === id);
      return currProject.tickets.length;
    },
    navigation(tickId, proId) {
      // tickId and proId passed as query in url link
      this.$router.push({
        path: '/ticket',
        query: { tickId, proId },
      });
    },
  },
};
</script>

<style scoped>

</style>
