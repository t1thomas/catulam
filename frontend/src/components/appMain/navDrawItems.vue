<template>
  <v-sheet height="100%">
    <v-content style="padding-left: 3.625rem">
      <v-select
        v-model="selected"
        class="pa-1"
        :items="projects"
        filled
        label="Select Project"
        item-value="id"
      >
        <template v-slot:selection="{ item }">
          <v-list-item-content style="flex: none">
            <v-list-item-title>{{ item.label }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.title }}</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <template v-slot:item="{on, item, attrs }">
          <v-list-item
            two-line
            v-bind="attrs"
            v-on="on"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.label }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.title }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>No Projects found</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-select>
      <v-list
        v-if="getCurrentUser"
        dense
      >
        <v-list-item
          color="primary"
          link
          to="/home"
        >
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>My Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="selected !== ''"
          color="primary"
          link
          :to="`/backlog?proId=${this.selected}`"
          exact
        >
          <v-list-item-action>
            <v-icon>mdi-view-list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Backlog</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <template v-if="selected !== ''">
          <v-list-group
            prepend-icon="mdi-view-dashboard-variant"
            no-action
            color="primary"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  Sprints ({{ getProjectSprints(selected).length }})
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <template v-if="getProjectSprints(selected).length > 0">
              <v-list-item
                v-for="sprint in getProjectSprints(selected)"
                :key="sprint.id"
                color="primary"
                link
                :to="`/sprint?sprintId=${sprint.id}&proId=${selected}`"
                exact
              >
                <v-list-item-title>
                  Sprint #{{ sprint.sprintNo }}
                </v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item v-else>
              <v-list-item-content>
                <v-list-item-title
                  class="font-italic"
                >
                  No Sprints Found
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <v-list-item v-if="errMessage">
          <v-list-item-content>
            <v-list-item-title
              class="font-italic"
            >
              {{ errMessage }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-btn @click="print">
        Print
      </v-btn>
    </v-content>
  </v-sheet>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

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
      'getViewingProject',
    ]),
    errMessage() {
      if (this.projects.length === 0) {
        return 'No Projects Found';
      } if (this.projects.length > 0 && this.getViewingProject === '') {
        return 'No Projects Selected';
      }
      return false;
    },
    selected: {
      get() {
        return this.getViewingProject;
      },
      set(val) {
        this.$store.dispatch('updateViewingPro', { project: { id: val } });
      },
    },
  },
  methods: {
    print() {
      console.log(this.getViewingProject);
    },
  },
};
</script>

<style scoped>

</style>
