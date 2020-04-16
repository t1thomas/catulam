<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        md="6"
      >
        <div
          color="warning"
          class="px-5 py-3"
        >
          WIP
        </div>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <UserTasks />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import UserTasks from '../components/dashboard/UserTasks.vue';

export default {
  name: 'Home',
  components: {
    UserTasks,
  },
};
</script>
