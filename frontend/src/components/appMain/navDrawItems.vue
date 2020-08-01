<template>
  <v-sheet height="100%">
    <v-content style="padding-left: 3.625rem">
      <v-select
        v-model="selected"
        class="pa-1"
        :items="projects"
        filled
        item
        item-text="label"
        item-value="id"
      >
        <template v-slot:selection="{ item }">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>{{ item.label }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.title }}</v-list-item-subtitle>
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
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="selected != null"
          color="primary"
          link
          :to="`/backlog?proId=${selected.id}`"
        >
          <v-list-item-action>
            <v-icon>mdi-view-list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Backlog</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <template v-if="selected != null">
          <v-list-group
            prepend-icon="mdi-view-dashboard-variant"
            no-action
            color="primary"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  Sprints ({{ getProjectSprints(selected.id).length}})
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <template v-if="getProjectSprints(selected.id).length > 0">
              <v-list-item
                v-for="sprint in getProjectSprints(selected.id)"
                :key="sprint.id"
                style="padding-left: 24px"
                color="primary"
                link
                :to="`/sprint?sprintId=${sprint.id}&proId=${selected.id}`"
              >
                <v-list-item-title>
                  Sprint {{ sprint.sprintNo }}
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
        <v-list-item v-else>
          <v-list-item-content>
            <v-list-item-title
              class="font-italic"
            >
              No Projects Found
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
  data: () => ({
    selected: null,
  }),
  computed: {
    ...mapState([
      'projects',
      'sprints',
    ]),
    ...mapGetters([
      'getSprintById',
      'getCurrentUser',
      'getProjectSprints',
    ]),
  },
  beforeUpdate() {
    // eslint-disable-next-line prefer-destructuring
    this.selected = this.projects[1];
  },
  methods: {
    print() {
      console.log(this.selected);
    },

  },
};
</script>

<style scoped>

</style>
