<template>
  <v-list
    v-if="currUser"
    dense
  >
    <v-list-item
      link
      to="/home"
    >
      <v-list-item-action>
        <v-icon>mdi-home</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-group
      prepend-icon="mdi-view-list"
      no-action
    >
      <template v-slot:activator>
        <v-list-item-title>Backlog</v-list-item-title>
      </template>
      <template v-if="projects.length > 0">
        <v-list-item
          v-for="(project, i) in projects"
          :key="i"
          link
          @click="toBacklog(project)"
        >
          <v-list-item-title v-text="project.label" />
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item>
          <v-list-item-title>
            No Projects Found
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list-group>


    <v-list-group
      prepend-icon="mdi-view-dashboard-variant"
      no-action
    >
      <template v-slot:activator>
        <v-list-item-title>Sprints</v-list-item-title>
      </template>
      <template v-if="!noSprints">
        <v-list-group
          v-for="project in projects"
          :key="project.id"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ project.label }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="sprint in project.sprints"
            :key="sprint.id"
            link
            @click="toSprint(sprint.id, project.id)"
          >
            <v-list-item-title>
              Sprint {{ sprint.sprintNo }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </template>
      <template v-else>
        <v-list-item>
          <v-list-item-title>
            No Sprints Found
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list-group>
  </v-list>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'NavDrawer',
  computed: {
    ...mapState({
      currUser: 'currentUser',
      devTasks: 'currentUserTasks',
      pmProjects: 'currPmProjects',
    }),
    projects() {
      if (this.currUser.type === 'pm') {
        return this.pmProjects;
      }
      return this.devTasks;
    },
    noSprints() {
      if (this.projects.length > 0) {
        const proWithSprints = this.projects.filter((pro) => pro.sprints.length > 0).length;
        return proWithSprints <= 0;
      }
      return true;
    },
  },
  methods: {
    toBacklog(project) {
      // proId passed as query in url link
      const { id } = project;
      this.$router.push({
        path: '/backlog',
        query: { proId: id },
      });
    },
    toSprint(sprintId, proId) {
      // proId passed as query in url link
      this.$router.push({
        path: '/sprint',
        query: { sprintId, proId },
      });
    },
    ...mapActions([
      'logoutUser',
    ]),
    async logout() {
      await this.logoutUser();
    },
  },
};
</script>

<style scoped>

</style>
