<template>
  <v-list dense>
    <v-list-item
      v-if="currUser"
      link
      @click="logout"
    >
      <v-list-item-action>
        <v-icon>mdi-logout-variant</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      v-if="currUser"
      link
      @click="print"
    >
      <v-list-item-action>
        <v-icon>mdi-logout-variant</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>PRINT</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-group
      v-if="projects"
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
  </v-list>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'NavDrawer',
  computed: {
    ...mapState({
      currUser: 'currentUser',
      projects: 'currentUserTasks',
    }),
  },
  methods: {
    print() {
      console.log(this.projects);
    },
    toBacklog(project) {
      // proId passed as query in url link
      const { id } = project;
      this.$router.push({
        path: '/backlog',
        query: { proId: id },
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
