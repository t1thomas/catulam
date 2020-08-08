<template>
  <v-hover
    v-slot:default="{ hover }"
    open-delay="100"
  >
    <v-card
      height="5.5rem"
      :elevation="hover ? 12 : 2"
      width="100%"
      @dblclick="detDrawShow({ show: true, ticketId: tickId })"
    >
      <v-card-title class="pt-1 pb-0 px-2">
        <span
          class="font-weight-bold body-2"
          :class="{'double-line': ticket.done}"
        >
          {{ ticket.title }}
        </span>
        <v-spacer />
        <span
          class="font-weight-thin body-2"
          :class="{'double-line': ticket.done}"
        >
          #{{ ticket.issueNumber }}
        </span>
      </v-card-title>
      <v-list-item
        class="py-0 px-2"
        dense
        style="min-height: auto"
        three-line
      >
        <v-list-item-content class="pa-0">
          <v-list-item-subtitle
            class="font-weight-light"
            style="font-size: 0.75rem"
            :class="{'double-line': ticket.done}"
          >
            {{ ticket.desc }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions class="pt-1 pb-0 card-bottom">
        <v-spacer />
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
          <v-avatar
            left
            tile
          >
            <v-img
              v-if="ticket.assignee !== null"
              :src="getGravatar(ticket.assignee.id)"
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
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'TicketCard',
  props: {
    tickId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      'getTicketById',
      'getGravatar',
      'getFullName',
    ]),
    ticket() {
      return this.getTicketById(this.tickId);
    },
    fullName() {
      if (this.ticket.assignee === null) {
        return 'n/a';
      }
      return this.getFullName(this.ticket.assignee.id);
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
  .card-bottom {
    position:absolute;
    bottom:1px;
    right:1px;
  }
  .dash {
    border: 0.1rem solid white;
    width: 10%;
    left: 0.4rem;
    z-index: 5;
  }
  .double-line {
    text-decoration-line: line-through;
    text-decoration-style: double;
    text-decoration-color: #ffffff;
  }
</style>
