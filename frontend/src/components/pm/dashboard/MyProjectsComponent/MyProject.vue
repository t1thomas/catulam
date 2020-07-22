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
    <not-found-card
      v-if="projects.length <= 0"
      type="Project"
      @createAction="createProDialog"
    />
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
import NotFoundCard from '../../../NotFoundCard.vue';

export default {
  name: 'MyProjectComponent',
  components: {
    ProDetailsTabs,
    NotFoundCard,
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
    ...mapState([
      'projects',
    ]),
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
