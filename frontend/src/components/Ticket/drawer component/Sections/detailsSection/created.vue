<template>
  <tr>
    <td>
      Created By:
    </td>
    <td class="pa-0">
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>
            <v-avatar size="20px">
              <img
                :src="getGravatar(ticket.creator.id)"
                alt="Avatar"
              >
            </v-avatar>
            {{ getFullName(ticket.creator.id) }}
          </v-list-item-title>
          <v-list-item-subtitle v-text="creationTime" />
        </v-list-item-content>
      </v-list-item>
    </td>
  </tr>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'Created',
  computed: {
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
    ...mapGetters([
      'getGravatar',
      'getFullName',
    ]),
    creationTime() {
      const timestamp = this.ticket.creation_time;
      // const date = new Date(Number(timestamp));
      return moment.unix(timestamp).format('DD-MM-YYYY, HH:MM');
    },
  },
};
</script>

<style scoped>

</style>
