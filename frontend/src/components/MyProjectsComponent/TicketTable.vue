<template>
  <v-card flat>
    <not-found-card
      v-if="proTickets.length <= 0"
      type="Ticket"
      @createAction="navigate"
    />
    <v-simple-table v-else>
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
            @click="detDrawShow({ show: true, ticketId: ticket.id })"
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
                    :src="getGravatar(ticket.assignee.id)"
                  />
                </v-avatar>
                {{ getFullName(ticket.assignee.id) }}
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import NotFoundCard from '../NotFoundCard.vue';

export default {
  name: 'TicketTable',
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
    ...mapGetters([
      'getFullName',
      'getGravatar',
    ]),
    proTickets() {
      return this.$store.getters.getProjectTickets(this.projectId);
    },
  },
  methods: {
    ...mapActions([
      'detDrawShow',
    ]),
    navigate() {
      console.log('dont forget navigation to backlog and open dialog');
    },
  },
};
</script>

<style scoped>

</style>
