<template>
  <v-hover
    v-slot:default="{ hover }"
    open-delay="100"
  >
    <v-card
      v-if="ticket"
      :elevation="hover ? 12 : 2"
      width="100%"
    >
      <v-row no-gutters>
        <v-col style="text-align: center">
          <span class="font-weight-medium body-2">
            {{ ticket.title }}    #{{ ticket.issueNumber }}
          </span>
          <v-chip
            x-small
            color="dark-grey"
            text-color="white"
          >
            <v-avatar left>
              <v-icon>mdi-progress-clock</v-icon>
            </v-avatar>
            {{ ticket.hourEstimate }}hr
          </v-chip>
          <v-chip
            x-small
            pill
            class="ml-2"
          >
            <v-avatar
              left
              tile
            >
              <v-img
                v-if="assignee"
                :src="gravatar"
              />
              <v-icon
                v-else
                dark
              >
                mdi-help-circle
              </v-icon>
            </v-avatar>
            {{ fullName }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card>
  </v-hover>
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
      const memObj = this.members.find((member) => member.User.id === this.ticket.assignee.id);
      return memObj.User;
    },
    ticket() {
      return this.getTicketById(this.tickId);
    },
    gravatar() {
      return `https://gravatar.com/avatar/${this.assignee.avatar}?d=identicon`;
    },
    fullName() {
      if (this.assignee === null) {
        return 'n/a';
      }
      return this.assignee.fullName;
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
