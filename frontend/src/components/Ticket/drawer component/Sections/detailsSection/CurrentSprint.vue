<template>
  <v-list-item>
    <v-list-item-content>Current Sprint:</v-list-item-content>
    <v-list-item-content
      v-if="ticket.sprint !== null"
      class="align-end"
    >
      <a
        style="cursor: pointer; max-width: fit-content;text-decoration-line: underline;"
        @click="onSprintLink"
      >
        Sprint {{ ticket.sprint.sprintNo }}
      </a>
    </v-list-item-content>
    <v-list-item-content
      v-else
      class="align-end"
    >
      N/a
    </v-list-item-content>
  </v-list-item>
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
      this.$emit('closeDrawer');
    },
  },
};
</script>

<style scoped>

</style>
