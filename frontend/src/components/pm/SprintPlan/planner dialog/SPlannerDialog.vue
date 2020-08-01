<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="700px"
    >
      <v-card
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
            <v-col
              cols="8"
              style="max-height: 100%"
            >
              <v-card style="height: 100%">
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
                          @click="openNSpDialog"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span class="caption">Add new Sprint</span>
                    </v-tooltip>
                  </v-list-item-icon>
                </v-list-item>

                <v-list
                  style="background: rgb(39, 54, 102);width: 100%; height: 82%; overflow-y: auto"
                >
                  <v-list-item
                    v-for="sprint in sprints"
                    :key="sprint.id"
                  >
                    <sprint-item :sprint="sprint" />
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
            color="primary darken-1"
            text
            @click="onCancel"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
      <nested-n-sp-dialog v-if="project" />
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import SprintItem from './SprintItem.vue';
import NestedNSpDialog from './NestedNSpDialog.vue';

export default {
  name: 'SprintPlanner',
  components: {
    SprintItem,
    NestedNSpDialog,
  },
  computed: {
    ...mapState({
      showDialog: (state) => state.sPlanDialog.show,
      project: (state) => state.sPlanDialog.project,
      sprints: (state) => state.sPlanDialog.sprints,
    }),
  },
  methods: {
    ...mapActions([
      'sPlannerShow',
    ]),
    onCancel() {
      this.sPlannerShow({ show: false });
    },
    openNSpDialog() {
      this.$store.commit('set_nSpDialog', true);
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
