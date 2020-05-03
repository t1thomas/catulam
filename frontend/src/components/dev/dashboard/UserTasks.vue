<template>
  <v-card
    v-if="projects"
    min-height="30vh"
  >
    <v-toolbar
      flat
      color="primary"
      dark
    >
      <v-toolbar-title>My Tasks</v-toolbar-title>
    </v-toolbar>
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
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="task in projectTasks(project.id)"
                :key="task.issueNo"
                style="cursor: pointer"
                @click="navigation(task)"
              >
                <td>
                  <v-icon
                    color="blue"
                  >
                    mdi-ticket-confirmation
                  </v-icon>
                </td>
                <td># {{ task.issueNo }}</td>
                <td>{{ task.title }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'UserTasks',
  data: () => ({
    tab: null,
    loaded: false,
  }),
  computed: {
    ...mapState({
      currUser: 'currentUser',
      projects: 'currentUserTasks',
    }),
    projectsNone() {
      return this.projects.length === 0;
    },
  },
  methods: {
    tasksTotal(id) {
      // find task with correct project Id
      const currProject = this.projects.find((project) => project.id === id);
      return currProject.tickets.length;
    },
    projectTasks(id) {
      const currProject = this.projects.find((project) => project.id === id);
      const tasks = [];
      currProject.tickets.forEach((tick) => {
        tasks.push({
          tickId: tick.id,
          proId: id,
          issueNo: tick.issueNumber,
          title: tick.title,
        });
      });
      return tasks;
    },
    navigation(task) {
      // tickId and proId passed as query in url link
      const { tickId, proId } = task;
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
