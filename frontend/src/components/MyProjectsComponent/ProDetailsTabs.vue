<template>
  <v-card flat>
    <v-tabs
      v-if="currProject !== null"
      vertical
      color="primary"
    >
      <v-tab style="place-content: start">
        <v-icon left>
          mdi-account
        </v-icon>
        Members
        <v-badge
          color="primary"
          inline
          :content="currProject.members.length.toString()"
        />
      </v-tab>
      <v-tab style="place-content: start">
        <v-icon left>
          mdi-ticket-confirmation
        </v-icon>
        Tickets
        <v-badge
          color="primary"
          inline
          :content="ticketsLength.toString()"
        />
      </v-tab>
      <v-tab style="place-content: start">
        <v-icon left>
          mdi-run-fast
        </v-icon>
        Sprints
        <v-badge
          color="primary"
          inline
          :content="currProject.sprints.length.toString()"
        />
      </v-tab>
      <v-btn
        color="#5c535366"
        class="ma-2 white--text"
        @click="navBacklog()"
      >
        Open Backlog
        <v-icon
          right
          dark
        >
          mdi-chevron-right
        </v-icon>
      </v-btn>
      <v-tab-item>
        <member-table :project-id="projectId" />
      </v-tab-item>
      <v-tab-item>
        <ticket-table :project-id="projectId" />
      </v-tab-item>
      <v-tab-item>
        <sprint-table :project-id="projectId" />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import TicketTable from './TicketTable.vue';
import MemberTable from './MemberTable.vue';
import SprintTable from './SprintTable.vue';

export default {
  name: 'ProDetailsTabs',
  components: {
    TicketTable,
    MemberTable,
    SprintTable,
  },
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  computed: {
    currProject() {
      return this.$store.getters.getProject(this.projectId);
    },
    proSprints() {
      return this.currProject.sprints;
    },
    ticketsLength() {
      return this.$store.getters.getProjectTickets(this.projectId).length;
    },
  },
  methods: {
    ...mapActions([
      'nUStoryDialogShow',
    ]),
    navBacklog() {
      this.$router.push({
        path: '/backlog',
        query: { proId: this.currProject.id },
      });
    },
    gravatar(member) {
      return `https://gravatar.com/avatar/${member.avatar}?d=identicon`;
    },
    unCompTicksCountSprint(sprint) {
      const unComplete = sprint.tickets.filter((tick) => tick.done === false);
      return unComplete.length;
    },
  },
};
</script>
<style scoped>

</style>
