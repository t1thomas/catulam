<template>
  <v-list-item
    class="member-item"
    @mouseenter="showTick = !showTick"
    @mouseleave="showTick = !showTick"
  >
    <v-list-item-avatar size="25">
      <v-img :src="getGravatar(member.id)" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-subtitle>{{ getFullName(member.id) }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn
        v-if="assignee !== null && isAssignee"
        icon
        @click="$emit('remove')"
      >
        <v-icon color="red">
          mdi-close-circle
        </v-icon>
      </v-btn>
      <v-btn
        v-else
        :style="{visibility: showTick ? 'visible' : 'hidden'}"
        icon
        @click="$emit('change', member)"
      >
        <v-icon color="green">
          mdi-check-circle
        </v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MemberItem',
  props: {
    member: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    showTick: false,
  }),
  computed: {
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
    ...mapGetters([
      'getGravatar',
      'getFullName',
    ]),
    assignee() {
      return this.ticket.assignee;
    },
    isAssignee() {
      return this.member.id === this.assignee.id;
    },
  },
};
</script>

<style scoped>

</style>
