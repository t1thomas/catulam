<template>
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
                    :src="gravatar(getMemberById(ticket.assignee.id).avatar)"
                  />
                </v-avatar>
                {{ getMemberById(ticket.assignee.id).fullName }}
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

export default {
  name: 'TicketTable',
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      'getMemberById',
    ]),
    proTickets() {
      return this.$store.getters.getCurrProject(this.projectId).tickets;
    },
  },
  methods: {
    ...mapActions([
      'detDrawShow',
    ]),
    gravatar(avatar) {
      return `https://gravatar.com/avatar/${avatar}?d=identicon`;
    },
  },
};
</script>

<style scoped>

</style>
