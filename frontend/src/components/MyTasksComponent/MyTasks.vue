<template>
  <v-card>
    <v-toolbar
      flat
      color="#3d4042"
      dark
    >
      <v-toolbar-title>My Tasks</v-toolbar-title>
    </v-toolbar>
    <not-found-card
      v-if="projects.length <= 0"
      type="Project"
      @createAction="createProDialog"
    />
    <v-tabs
      v-model="tab"
      color="white"
    >
      <template
        v-for="project in projects"
      >
        <v-tab :key="project.id">
          {{ project.label }} ({{ getTicks(project.id).length }})
        </v-tab>
        <v-tab-item
          :key="project.id"
          style="height: calc(100vh - 400px);overflow-y: auto; background: grey"
        >
          <v-list
            color="transparent"
            tile
          >
            <v-list-item v-if="getTicks(project.id).length === 0">
              <v-list-item-content>
                <v-list-item-title>No Tickets Found</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="tick in getTicks(project.id)"
              v-else
              :key="tick.id"
              class="mb-1"
            >
              <ticket-card :tick-id="tick.id" />
            </v-list-item>
          </v-list>
        </v-tab-item>
      </template>
    </v-tabs>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import ticketCard from '@/components/Ticket/card/ticketCard.vue';
import NotFoundCard from '@/components/NotFoundCard.vue';

export default {
  name: 'MyTasks',
  components: {
    ticketCard,
    NotFoundCard,
  },
  computed: {
    ...mapState([
      'projects',
    ]),
    ...mapGetters({
      getTicks: 'getProTicksByUser',
    }),
    tab: {
      get() {
        return this.$store.state.taskListTabsModel;
      },
      set(val) {
        this.$store.dispatch('onTskTabChange', val);
      },
    },
    tickets() {
      return this.getProTicksByUser(this.projectId);
    },
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
