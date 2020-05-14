<template>
  <v-card>
    <v-toolbar
      flat
      color="#3d4042"
      dark
    >
      <v-toolbar-title>My Projects</v-toolbar-title>
      <v-spacer />

      <v-btn
        @click="createProDialog"
      >
        Create
        <v-icon
          right
          dark
        >
          mdi-plus
        </v-icon>
      </v-btn>
    </v-toolbar>
    <v-container
      v-if="projectsNone"
      fluid
    >
      <v-card
        ripple
        tile
        style="background: rgb(39, 54, 102)"
        @click="createProDialog"
      >
        <div
          class="d-flex flex-no-wrap justify-space-between"
          style="height: 100px"
        >
          <div>
            <v-card-title
              class="headline"
            >
              0 Projects Found
            </v-card-title>

            <v-card-subtitle>
              Create New Project
            </v-card-subtitle>
          </div>

          <v-avatar
            size="100"
            tile
          >
            <v-icon dark>
              mdi-plus
            </v-icon>
          </v-avatar>
        </div>
      </v-card>
    </v-container>
    <template v-else>
      <v-tabs
        v-model="tab"
        color="white"
      >
        <v-tab
          v-for="project in projects"
          :key="project.id"
        >
          {{ project.label }}
        </v-tab>
      </v-tabs>
      <v-tabs-items
        v-model="tab"
        style="height: calc(100vh - 400px);overflow-y: auto;"
      >
        <v-tab-item
          v-for="project in projects"
          :key="project.id"
        >
          <pro-details-tabs :project-id="project.id" />
        </v-tab-item>
      </v-tabs-items>
    </template>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ProDetailsTabs from './ProDetailsTabs.vue';

export default {
  name: 'ProjectList',
  components: {
    ProDetailsTabs,
  },
  computed: {
    tab: {
      get() {
        return this.$store.state.proListTabsModel;
      },
      set(val) {
        this.$store.dispatch('onTabChange', val);
      },
    },
    // this property always returns true if there are no new projects
    projectsNone() {
      return this.projects === null;
    },
    ...mapState({
      projects: (state) => state.currPmProjects,
    }),
  },
  methods: {
    ...mapActions([
      'nProDialogShow',
    ]),
    createProDialog() {
      this.nProDialogShow({ show: true });
    },
  },
};
</script>

<style scoped>

</style>
