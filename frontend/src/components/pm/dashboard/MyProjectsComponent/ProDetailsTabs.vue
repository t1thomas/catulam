<template>
  <v-card flat>
    <v-tabs
      v-if="currProject !== null"
      vertical
      color="#7ea9c5"
    >
      <v-tab style="place-content: start">
        <v-icon left>
          mdi-account
        </v-icon>
        Members
        <v-badge
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
          inline
          :content="currProject.tickets.length.toString()"
        />
      </v-tab>
      <v-tab style="place-content: start">
        <v-icon left>
          mdi-run-fast
        </v-icon>
        Sprints
        <v-badge
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
        <v-card flat>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>
                    Member
                  </th>
                  <th>
                    To do (Tickets)
                  </th>
                  <th>
                    Done (Tickets)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="member in proMembers"
                  :key="member.id"
                >
                  <td>
                    <v-chip
                      pill
                    >
                      <v-avatar left>
                        <v-img
                          :src="gravatar(member)"
                        />
                      </v-avatar>
                      {{ member.fullName }}
                      <v-chip
                        v-if="member.role === 'pm'"
                        class="ml-2"
                        x-small
                        color="orange"
                        text-color="white"
                      >
                        PM
                        <v-icon
                          right
                          x-small
                        >
                          mdi-crown
                        </v-icon>
                      </v-chip>
                    </v-chip>
                  </td>
                  <td>
                    {{ unCompleteTicksCount(member) }}
                  </td>
                  <td>
                    {{ doneTicksCount(member) }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>
                    Name
                  </th>
                  <th>
                    Estimate (Hrs)
                  </th>
                  <th>
                    Completed
                  </th>
                  <th>
                    Assignee
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="ticket in proTickets"
                  :key="ticket.id"
                  style="cursor: pointer"
                  @click="tickNavigation(ticket)"
                >
                  <td>
                    {{ ticket.title }}
                  </td>
                  <td>
                    {{ ticket.hourEstimate.toString() }}
                  </td>
                  <td>
                    <v-icon
                      v-if="ticket.done"
                      color="green"
                    >
                      mdi-check
                    </v-icon>
                    <v-icon
                      v-else
                      color="amber"
                    >
                      mdi-close
                    </v-icon>
                  </td>
                  <td>
                    <v-chip
                      v-if="ticket.assignee !== null"
                      pill
                      small
                    >
                      <v-avatar left>
                        <v-img
                          :src="gravatar(memberByID(ticket.assignee.id))"
                        />
                      </v-avatar>
                      {{ memberByID(ticket.assignee.id).fullName }}
                    </v-chip>
                    <v-chip
                      v-else
                      small
                      pill
                    >
                      <v-avatar left>
                        <v-icon
                          dark
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-avatar>
                      Unassigned
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <not-found-card
          v-if="proSprints.length <= 0"
          type="Sprint"
          @createAction="sPlanShow"
        />
        <v-card
          v-else
          flat
        >
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>
                    Sprint
                  </th>
                  <th>
                    Tickets
                  </th>
                  <th>
                    Status
                  </th>
                  <th>
                    Start ~ End
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="sprint in proSprints"
                  :key="sprint.id"
                  style="cursor: pointer"
                  @click="sprintNavigation(sprint)"
                >
                  <td>
                    Sprint {{ sprint.sprintNo }}
                  </td>
                  <td>
                    {{ unCompTicksCountSprint(sprint) }}
                  </td>
                  <td>
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
                  </td>
                  <td>
                    {{ sprint.startDate }} ~ {{ sprint.endDate }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import NotFoundCard from '../../../NotFoundCard.vue';

export default {
  name: 'ProDetailsTabs',
  components: {
    NotFoundCard,
  },
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  computed: {
    currProject() {
      return this.$store.getters.getCurrProject(this.projectId);
    },
    proMembers() {
      // get all the members from state.currPmProjects
      return this.currProject.members.map((member) => member.User);
    },
    proTickets() {
      return this.currProject.tickets;
    },
    proSprints() {
      return this.currProject.sprints;
    },
    proTicketsComplete() {
      return this.currProject.tickets.filter((tick) => tick.done === true);
    },
    proTicketsUnComplete() {
      return this.currProject.tickets.filter((tick) => tick.done === false);
    },
  },
  methods: {
    ...mapActions([
      'sPlannerShow',
      'nUStoryDialogShow',
    ]),
    navBacklog() {
      this.$router.push({
        path: '/backlog',
        query: { proId: this.currProject.id },
      });
    },
    sPlanShow() {
      this.navBacklog();
      this.sPlannerShow({ show: true, proId: this.currProject.id });
    },
    memberByID(id) {
      return this.proMembers.find((member) => member.id === id);
    },
    gravatar(member) {
      return `https://gravatar.com/avatar/${member.avatar}?d=identicon`;
    },
    doneTicksCount(member) {
      const completed = this.proTicketsComplete
        .filter((tick) => (tick.assignee) && tick.assignee.id === member.id);
      return completed.length;
    },
    unCompleteTicksCount(member) {
      const unComplete = this.proTicketsUnComplete
        .filter((tick) => (tick.assignee) && tick.assignee.id === member.id);
      return unComplete.length;
    },
    unCompTicksCountSprint(sprint) {
      const unComplete = sprint.tickets.filter((tick) => tick.done === false);
      return unComplete.length;
    },
    tickNavigation(ticket) {
      this.$router.push({
        path: '/ticket',
        query: { tickId: ticket.id, proId: this.currProject.id },
      });
    },
    sprintNavigation(sprint) {
      this.$router.push({
        path: '/sprint',
        query: { sprintId: sprint.id, proId: this.currProject.id },
      });
    },
  },
};
</script>
<style scoped>

</style>
