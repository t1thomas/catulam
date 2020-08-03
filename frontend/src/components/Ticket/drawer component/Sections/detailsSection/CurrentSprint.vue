<template>
  <tr>
    <td>Current Sprint:</td>
    <td v-if="ticket.sprint !== null">
      <a
        style="cursor: pointer; max-width: fit-content;text-decoration-line: underline;"
        @click="onSprintLink"
      >
        Sprint {{ ticket.sprint.sprintNo }}
      </a>
    </td>
    <td v-else>
      N/a
    </td>
  </tr>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CurrentSprint',
  computed: {
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
  },
  methods: {
    onSprintLink() {
      this.$router.push({
        path: '/sprint',
        query: { sprintId: this.ticket.sprint.id, proId: this.ticket.project.id },
      });
      this.$store.dispatch('detDrawShow', { show: false });
    },
  },
};
</script>

<style scoped>

</style>
