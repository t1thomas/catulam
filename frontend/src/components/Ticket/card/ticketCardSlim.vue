<template>
  <v-card
    v-if="ticket"
    width="100%"
    :disabled="ticket.done"
    @dblclick="detDrawShow({ show: true, ticketId: ticket.id })"
  >
    <div
      v-if="ticket.done"
      class="dash"
      style="position: absolute"
    />
    <v-tooltip
      bottom
      :open-delay="tipDelay"
    >
      <template v-slot:activator="{ on }">
        <v-list-item
          style="width: 100%; height: 30px"
          class="pl-0 pr-0"
          v-on="on"
        >
          <v-list-item-content>
            <v-list-item-title class="font-weight-thin caption">
              #{{ ticket.issueNumber }} {{ ticket.title }}
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action class="ml-0 pr-1">
            <div>
              <v-chip
                style="padding-left: 0"
                x-small
                color="dark-grey"
                text-color="white"
              >
                <v-avatar
                  left
                  style="margin-left: 0"
                >
                  <v-icon small>
                    mdi-progress-clock
                  </v-icon>
                </v-avatar>
                {{ ticket.hourEstimate }}hr
              </v-chip>
              <v-chip
                style="padding-left: 0"
                x-small
                class="ml-2"
              >
                <v-avatar
                  style="margin-left: 0"
                  left
                  tile
                >
                  <v-img
                    v-if="assignee"
                    :src="gravatar"
                  />
                  <v-icon
                    v-else
                    small
                    dark
                  >
                    mdi-help-circle
                  </v-icon>
                </v-avatar>
                {{ fullName }}
              </v-chip>
            </div>
          </v-list-item-action>
        </v-list-item>
      </template>
      <span> #{{ ticket.issueNumber }} {{ ticket.title }}</span>
    </v-tooltip>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'TicketCard',
  props: {
    tickId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    tipDelay: 1200,
  }),
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
  methods: {
    ...mapActions([
      'detDrawShow',
    ]),
  },
};
</script>

<style scoped>
  .dash {
    border: 0.1rem solid white;
    width: 95%;
    height: 0px;
    top: 50%;
    left: 0.4rem;
    z-index: 3;
  }
</style>
