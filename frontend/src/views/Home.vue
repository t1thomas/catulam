<template>
  <v-container
    fluid
    class="fill-height"
  >
    <v-row>
      <v-col
        cols="4"
      >
        <my-tasks />
      </v-col>
      <v-col
        cols="8"
      >
        <project-list />
      </v-col>
    </v-row>
    <n-pro-dialog v-if="userType==='pm'" />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import NProDialog from '@/components/Project/dialogs/NProDialog.vue';
import ProjectList from '@/components/MyProjectsComponent/MyProjectsParent.vue';
import MyTasks from '@/components/MyTasksComponent/MyTasks.vue';

export default {
  name: 'Home',
  components: {
    NProDialog,
    ProjectList,
    MyTasks,
  },
  computed: {
    ...mapGetters([
      'getCurrentUser',
    ]),
    userType() {
      return this.getCurrentUser.role;
    },
  },
};
</script>
