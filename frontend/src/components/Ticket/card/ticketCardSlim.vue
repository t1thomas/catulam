<template>
  <v-list-item
    v-ripple
    class="pa-0 ma-sm-1"
    clickable
    @dblclick="detDrawShow({ show: true, ticketId: ticket.id })"
  >
    <v-card
      v-if="ticket"
      width="100%"
      :disabled="ticket.done"
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
                      v-if="ticket.assignee !== null"
                      :src="getGravatar(ticket.assignee.id)"
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
  </v-list-item>
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
  data: () => ({
    tipDelay: 1200,
  }),
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
  .dash {
    border: 0.1rem solid white;
    width: 95%;
    height: 0px;
    top: 50%;
    left: 0.4rem;
    z-index: 3;
  }
</style>
