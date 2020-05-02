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
          <v-btn
            class="primary"
            @click="print"
          >
            Print
          </v-btn>
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
// import Vue from 'vue';
import UserTasks from './UserTasks.vue';
// import gqlQueries from '../graphql/gql-queries';

export default {
  name: 'DevHome',
  components: {
    UserTasks,
  },
  methods: {
    async print() {
      // await Vue.$apolloClient.query({
      //   query: gqlQueries.ALL_USERS,
      //   fetchPolicy: 'no-cache',
      // }).then((response) => {
      //   const { User } = response.data;
      //   console.log(User);
      // }).catch((error) => {
      //   console.error(error);
      // });
    },
  },
};
</script>
