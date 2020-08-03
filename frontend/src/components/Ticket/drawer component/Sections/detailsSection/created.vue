<template>
  <tr>
    <td>
      Created:
    </td>
    <td style="display: inline-grid; white-space: nowrap">
      <v-chip
        pill
        small
      >
        <v-avatar
          left
        >
          <v-img
            :src="getGravatar(ticket.creator.User.id)"
          />
        </v-avatar>
        {{ getFullName(ticket.creator.User.id) }}
      </v-chip>
      <span class="caption">
        @{{ creationTime }}
      </span>
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
      const { timestamp } = this.ticket.creator;
      // const date = new Date(Number(timestamp));
      return moment.unix(timestamp).format('DD-MM-YYYY, HH:MM');
    },
  },
};
</script>

<style scoped>

</style>
