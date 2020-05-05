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
        <v-card-text
          style="height: 90%"
          class="pb-0"
        >
          <v-row class="fill-height">
            <v-col cols="4">
              <div>
                Some
              </div>
            </v-col>
            <v-col cols="8">
              <v-card style="height: 88%">
                <v-list-item
                  style="background-color: #2e2b2b"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      class="subtitle-2"
                      style="text-align: center"
                    >
                      Start Date: {{ project.startDate }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          fab
                          color="#4d371a"
                          x-small
                          v-on="on"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span class="caption">Add new Sprint</span>
                    </v-tooltip>
                  </v-list-item-icon>
                </v-list-item>

                <v-list
                  style="background: rgb(39, 54, 102);width: 100%;height: 100%;"
                >
                  <v-list-item
                    v-for="sprint in sprints"
                    :key="sprint.id"
                  >
                    <v-list-item-content>
                      <v-card>
                        <v-row>
                          <v-col
                            cols="auto"
                            style="text-align: center;"
                          >
                            <span class="subtitle-1">
                              Sprint {{ sprint.sprintNo }}
                            </span>
                            <v-list dense>
                              <v-list-item>
                                <v-list-item-content>
                                  <v-chip
                                    small
                                    style="width: inherit"
                                    color="#2f6532"
                                    label
                                    class="mb-2"
                                  >
                                    <v-avatar
                                      tile
                                      color="#124c11"
                                      left
                                    >
                                      <span>Start</span>
                                    </v-avatar>
                                    {{ sprint.startDate }}
                                  </v-chip>
                                </v-list-item-content>
                              </v-list-item>

                              <v-list-item>
                                <v-list-item-content>
                                  <v-chip
                                    small
                                    color="#ab1a2e"
                                    style="width: inherit"
                                    label
                                  >
                                    <v-avatar
                                      tile
                                      color="#670d0d"
                                      left
                                    >
                                      End
                                    </v-avatar>
                                    <span>
                                      {{ sprint.endDate }}
                                    </span>
                                  </v-chip>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-col>
                          <v-col
                            cols="auto"
                            style="text-align: center;"
                          >
                            <v-card flat>
                              <v-simple-table>
                                <template v-slot:default>
                                  <thead>
                                    <tr>
                                      <th>
                                        Days
                                      </th>
                                      <th>
                                        To do
                                      </th>
                                      <th>
                                        Done
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        {{ daysBetween(sprint).toString() }}
                                      </td>
                                      <td>
                                        {{ unCompleteTickets(sprint).toString() }}
                                      </td>
                                      <td>
                                        {{ completeTickets(sprint).toString() }}
                                      </td>
                                    </tr>
                                  </tbody>
                                </template>
                              </v-simple-table>
                            </v-card>
                            <span v-if="sprint.active">
                              Active
                              <v-badge
                                dot
                                color="#3aaf25"
                                inline
                              />
                            </span>
                            <span v-else>
                              In-active
                              <v-badge
                                dot
                                color="#ffae4a"
                                inline
                              />
                            </span>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-list-item-content>
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
    sprints: null,
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
    daysBetween(sprint) {
      const start = Vue.$moment(sprint.startDate);
      const end = Vue.$moment(sprint.endDate);
      return end.diff(start, 'days');
    },
    unCompleteTickets(sprint) {
      return sprint.tickets.filter((tick) => tick.done === false).length;
    },
    completeTickets(sprint) {
      return sprint.tickets.filter((tick) => tick.done === true).length;
    },
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
        console.log(Project);
        // eslint-disable-next-line prefer-destructuring
        self.project = Project[0];
        self.sprints = Project[0].sprints.sort((a, b) => a.sprintNo - b.sprintNo);
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
  .v-chip .v-avatar {
    height: 48px!important;
    min-width: 48px!important;
    width: 48px!important;
  }
</style>
