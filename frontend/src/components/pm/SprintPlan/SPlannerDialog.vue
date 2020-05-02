<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="700px"
    >
      <v-progress-circular
        v-if="!dataLoaded"
        style="display: contents"
        :size="50"
        color="primary"
        indeterminate
      />
      <v-card
        v-else
        height="75vh"
        dark
      >
        <v-card-text style="height: 90%" class="pb-0">
          <v-row class="fill-height">
            <v-col cols="8">
              <div>
                Some
              </div>
            </v-col>
            <v-col cols="4">
              <v-card style="height: 88%">
                <v-list-item style="background-color: #2e2b2b">
                  <v-list-item-title class="subtitle-2">
                    Start Date: {{ project.startDate }}
                  </v-list-item-title>
                </v-list-item>
                <v-list
                  style="background: rgb(39, 54, 102);width: 100%;height: 100%;"
                >
                  <v-list-item class="justify-center">
                    <v-btn small>
                      Add New Sprint
                      <v-icon right small dark>mdi-plus</v-icon>
                    </v-btn>
                  </v-list-item>
                </v-list>
                <v-card-actions
                  style="background-color: #2e2b2b"
                  class="justify-center"
                >
                  <span class="subtitle-2">
                    End Date: {{ project.endDate }}
                  </span>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="onCancel"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Vue from 'vue';
import gqlQueries from '../../../graphql/gql-queries';

export default {
  name: 'SprintPlanner',
  data: () => ({
    project: null,
  }),
  computed: {
    ...mapState({
      showDialog: (state) => state.sPlanDialog.show,
      proId: (state) => state.sPlanDialog.proId,
    }),
    dataLoaded() {
      return this.project !== null;
    },
  },
  async mounted() {
    await this.sPlannerData();
  },
  methods: {
    ...mapActions([
      'sPlannerShow',
    ]),
    onCancel() {
      this.sPlannerShow({ show: false });
    },
    async sPlannerData() {
      const self = this;
      await Vue.$apolloClient.query({
        query: gqlQueries.S_PLANNER_DATA,
        fetchPolicy: 'no-cache',
        variables: { id: this.proId },
      }).then((response) => {
        const { Project } = response.data;
        // eslint-disable-next-line prefer-destructuring
        self.project = Project[0];
      }).catch((error) => {
        console.log('Unable to load Sprint Planner');
        console.error(error);
      });
    },
  },
};
</script>

<style scoped>
.item-start {
  padding-bottom: 40vh;
}
</style>
