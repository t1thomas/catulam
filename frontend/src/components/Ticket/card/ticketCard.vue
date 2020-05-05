<template>
  <v-card
    height="5.5rem"
    width="100%"
  >
    <v-list-item
      three-line
      class="px-2"
    >
      <v-list-item-content class="py-0 d-inline-block">
        <v-list-item-title class="d-flex mb-0">
          <span class="font-weight-medium body-2">
            {{ ticket.title }}
          </span>
          <span class="font-weight-thin ml-auto body-2">
            #{{ ticket.issueNumber }}
          </span>
        </v-list-item-title>
        <v-list-item-subtitle class="pa-0">
          <span class="font-weight-light caption">
            {{ ticket.desc }}
          </span>
        </v-list-item-subtitle>
        <div class="card-bottom">
          <v-chip
            small
            color="dark-grey"
            text-color="white"
          >
            <v-avatar left>
              <v-icon>mdi-progress-clock</v-icon>
            </v-avatar>
            {{ ticket.hourEstimate }}hr
          </v-chip>
          <v-chip
            small
            pill
            class="ml-2"
          >
            <v-avatar left tile>
              <v-img
                v-if="assignee"
                :src="gravatar()"
              />
              <v-icon
                v-else
                dark
              >
                mdi-help-circle
              </v-icon>
            </v-avatar>
            {{ fullName(assignee) }}
          </v-chip>
        </div>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'TicketCard',
  props: {
    tickId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      members: (state) => state.currProElements.members,
    }),
    ...mapGetters([
      'getTicketById',
    ]),
    assignee() {
      if (this.ticket.assignee === null) {
        return null;
      }
      return this.members.find((member) => member.id === this.ticket.assignee.id);
    },
    ticket() {
      return this.getTicketById(this.tickId);
    },
  },
  methods: {
    gravatar() {
      return `https://gravatar.com/avatar/${this.assignee.avatar}?d=identicon`;
    },
    fullName() {
      if (this.assignee === null) {
        return 'Unassigned';
      }
      return `${this.assignee.firstName} ${this.assignee.lastName}`;
    },
  },
};
</script>

<style scoped>
  .card-bottom {
    position:absolute;
    bottom:1px;
    right:1px;
  }
</style>
