<template>
  <v-list
    v-if="getCurrentUser"
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
    <template v-if="projects.length > 0">
      <v-list-group
        v-for="project in projects"
        :key="project.id"
        no-action
        color="myBlue"
      >
        <template v-slot:activator>
          <v-list-item-title>{{ project.label }}</v-list-item-title>
        </template>
        <v-list-group
          no-action
          sub-group
          color="myBlue"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Sprints</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="sprint in getProjectSprints(project.id)"
            :key="sprint.id"
            color="myBlue"
            link
            :to="`/sprint?sprintId=${sprint.id}&proId=${project.id}`"
          >
            <v-list-item-title>
              Sprint {{ sprint.sprintNo }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-item
          link
          style="padding-left: 24px"
          color="myBlue"
          :to="`/backlog?proId=${project.id}`"
        >
          <v-list-item-action>
            <v-icon left>
              mdi-view-list
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Backlog</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </template>
    <v-list-item v-else>
      <v-list-item-content>
        <v-list-item-title
          class="font-italic"
        >
          No Projects Found
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
  name: 'NavDrawer',
  computed: {
    ...mapState([
      'projects',
      'sprints',
    ]),
    ...mapGetters([
      'getSprintById',
      'getCurrentUser',
      'getProjectSprints',
    ]),
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
    toProject(project) {
      // proId passed as query in url link
      const { id } = project;
      this.$router.push({
        path: '/project',
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
