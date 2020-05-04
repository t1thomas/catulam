<template>
  <v-card flat>
    <v-tabs
      v-if="currProject !== null"
      vertical
      color="orange"
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
          mdi-book-open-page-variant
        </v-icon>
        User Stories
        <v-badge
          inline
          :content="currProject.userStories.length.toString()"
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

      <v-tab-item>
        <v-btn
          class="primary"
          @click="print"
        >
          Print
        </v-btn>
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
                        v-if="member.type === 'pm'"
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
          v-if="proStories.length <= 0"
          type="UStory"
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
                    Story
                  </th>
                  <th>
                    Tickets
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="story in proStories"
                  :key="story.id"
                >
                  <td
                    style="word-wrap: break-word;white-space: normal;"
                  >
                    {{ story.storyText }}
                  </td>
                  <td>
                    {{ story.tickets.length.toString() }}
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
                    Story
                  </th>
                  <th>
                    Tickets
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="story in proStories"
                  :key="story.id"
                >
                  <td
                    style="word-wrap: break-word;white-space: normal;"
                  >
                    {{ story.storyText }}
                  </td>
                  <td>
                    {{ story.tickets.length.toString() }}
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
import { mapState, mapActions } from 'vuex';
import NotFoundCard from './NotFoundCard.vue';

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
    ...mapState({
      projects: (state) => state.currPmProjects,
      allUsers: (state) => state.allUserList,
    }),
    currProject() {
      if (this.projects === null || this.allUsers === null) {
        return null;
      }
      return this.projects.find((project) => project.id === this.projectId);
    },
    proMembers() {
      // get all the members from state.currPmProjects
      return this.currProject.members.map((member) => member.User);
    },
    proTicketsComplete() {
      return this.currProject.tickets.filter((tick) => tick.done === true);
    },
    proTicketsUnComplete() {
      return this.currProject.tickets.filter((tick) => tick.done === false);
    },
    proTickets() {
      return this.currProject.tickets;
    },
    proStories() {
      return this.currProject.userStories;
    },
    proSprints() {
      return this.currProject.sprints;
    },
  },
  methods: {
    ...mapActions([
      'sPlannerShow',
    ]),
    sPlanShow() {
      this.sPlannerShow({ show: true, proId: this.currProject.id });
    },
    memberByID(id) {
      return this.proMembers.find((member) => member.id === id);
    },
    gravatar(member) {
      return `https://gravatar.com/avatar/${member.avatar}?d=identicon`;
    },
    print() {
      console.log(this.proMembers);
    },
    doneTicksCount(member) {
      const completed = this.proTicketsComplete.filter((tick) => tick.assignee.id === member.id);
      return completed.length;
    },
    unCompleteTicksCount(member) {
      const unComplete = this.proTicketsUnComplete.filter((tick) => tick.assignee.id === member.id);
      return unComplete.length;
    },
    tickNavigation(ticket) {
      this.$router.push({
        path: '/ticket',
        query: { tickId: ticket.id, proId: this.currProject.id },
      });
    },
  },
};
</script>
<style scoped>

</style>
