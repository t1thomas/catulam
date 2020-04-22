<template>
  <v-card v-if="loaded">
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
                    v-if="task.type === 'ticket'"
                    color="blue"
                  >
                    mdi-ticket-confirmation
                  </v-icon>
                  <v-icon
                    v-else
                    color="green"
                  >
                    mdi-book-open-page-variant
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
import Vue from 'vue';
import { mapGetters } from 'vuex';
import gqlQueries from '../../graphql/gql-queries';

export default {
  name: 'UserTasks',
  data: () => ({
    tab: null,
    projects: null,
    loaded: false,
  }),
  computed: {
    ...mapGetters([
      'getCurrentUser',
    ]),
  },
  async mounted() {
    await this.userTasks();
  },
  methods: {
    tasksTotal(id) {
      // find task with correct project Id
      const currProject = this.projects.find((project) => project.id === id);
      return currProject.tickets.length + currProject.userStories.length;
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
          type: 'ticket',
        });
      });
      currProject.userStories.forEach((story) => {
        tasks.push({
          id: story.id,
          issueNo: story.issueNumber,
          title: story.storyText,
          type: 'story',
        });
      });

      return tasks;
    },
    async userTasks() {
      await Vue.$apolloClient.query({
        query: gqlQueries.USER_TASKS,
        fetchPolicy: 'no-cache',
        variables: { username: this.getCurrentUser.username },
      })
        .then((response) => {
          const { User } = response.data;
          this.projects = User[0].projects;
          this.loaded = true;
        })
        .catch((error) => {
          console.log('User not found');
          console.error(error);
        });
    },
    navigation(task) {
      if (task.type === 'ticket') {
        // tickId and proId passed as query in url link
        const { tickId, proId } = task;
        this.$router.push({
          path: '/ticket',
          query: { tickId, proId },
        });
      } else if (task.type === 'story') {
        this.$router.push({
          path: '/uStory',
          query: { id: task.id },
        });
      }
    },
  },
};
</script>

<style scoped>

</style>
