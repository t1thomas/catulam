<template>
  <v-card
    min-height="30vh"
  >
    <v-toolbar
      flat
      color="myBlue"
      dark
    >
      <v-toolbar-title>My Tasks</v-toolbar-title>
    </v-toolbar>
    <no-project v-if="projectsNone" />
    <pro-tabs v-else />
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import NoProjectCard from './NoProjectCard.vue';
import ProjectTabs from './ProjectTabs.vue';

export default {
  name: 'UserTasks',
  components: {
    'no-project': NoProjectCard,
    'pro-tabs': ProjectTabs,
  },
  computed: {
    ...mapState({
      currUser: 'currentUser',
      projects: 'currentUserTasks',
    }),
    projectsNone() {
      return this.projects.length === 0;
    },
  },
};
</script>

<style scoped>

</style>
