<template>
  <tr>
    <td>Status:</td>
    <td v-if="status">
      <v-badge
        class="justify-start"
        color="success"
        icon="mdi-check"
        inline
      >
        Completed
      </v-badge>
    </td>
    <td v-else>
      <v-badge
        class="justify-start"
        color="warning"
        dot
        inline
      >
        Uncompleted
      </v-badge>
    </td>
  </tr>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Status',
  computed: {
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
    status() {
      return this.ticket.done;
    },
  },
};
</script>

<style scoped>

</style>
