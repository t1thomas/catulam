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
        <ProjectList />
      </v-col>
    </v-row>
    <NProDialog v-if="showDialog"/>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import NProDialog from '../components/pm/dashboard/NProDialog.vue';
import ProjectList from '../components/pm/dashboard/ProjectList.vue';

export default {
  name: 'Home',
  components: {
    NProDialog,
    ProjectList,
  },
  computed: {
    ...mapState({
      currUser: (state) => state.currentUser,
      showDialog: (state) => state.nProDialog.show,
    }),
  },
  async mounted() {
    await this.fetchPmPros({ username: this.currUser.username });
  },
  methods: {
    ...mapActions([
      'fetchPmPros',
    ]),
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
