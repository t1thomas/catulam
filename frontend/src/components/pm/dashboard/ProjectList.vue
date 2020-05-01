<template>
  <v-card>
    <v-toolbar
      flat
      color="primary"
      dark
    >
      <v-toolbar-title>My Projects</v-toolbar-title>
      <v-spacer />

      <v-btn
        @click="createProDialog"
      >
        Create
        <v-icon
          right
          dark
        >
          mdi-plus
        </v-icon>
      </v-btn>
    </v-toolbar>
    <v-container
      v-if="projectsNone"
      fluid
    >
      <v-card
        ripple
        tile
        style="background: rgb(39, 54, 102)"
        @click="createProDialog"
      >
        <div
          class="d-flex flex-no-wrap justify-space-between"
          style="height: 100px"
        >
          <div>
            <v-card-title
              class="headline"
            >
              0 Projects Found
            </v-card-title>

            <v-card-subtitle>
              Create New Project
            </v-card-subtitle>
          </div>

          <v-avatar
            size="100"
            tile
          >
            <v-icon dark>
              mdi-plus
            </v-icon>
          </v-avatar>
        </div>
      </v-card>
    </v-container>
    <v-tabs
      v-if="!projectsNone"
      v-model="tab"
    >
      <v-tab
        v-for="project in projects"
        :key="project.id"
      >
        {{ project.label }}
      </v-tab>
    </v-tabs>
    <v-tabs-items
      style="height: calc(100vh - 400px);overflow-y: auto;"
      v-if="!projectsNone"
      v-model="tab"
    >
      <v-tab-item
        v-for="project in projects"
        :key="project.id"
      >
        <pro-details-tabs :project-id="project.id" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ProDetailsTabs from './ProDetailsTabs.vue';

export default {
  name: 'ProjectList',
  components: {
    ProDetailsTabs,
  },
  data: () => ({
    tab: null,
  }),
  computed: {
    // this property always returns true if there are no new projects
    projectsNone() {
      return this.projects === null;
    },
    ...mapState({
      projects: (state) => state.currPmProjects,
    }),
  },
  methods: {
    ...mapActions([
      'nProDialogShow',
    ]),
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
    createProDialog() {
      this.nProDialogShow({ show: true });
    },
  },
};
</script>

<style scoped>

</style>
