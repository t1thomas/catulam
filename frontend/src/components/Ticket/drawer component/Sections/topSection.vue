<template>
  <v-row>
    <v-col
      cols="4"
    >
      <span class="headline">
        {{ ticket.title }}
      </span>
      <span class="horiz-line" />
      <span class="headline">
        #{{ ticket.issueNumber }}
      </span>
    </v-col>
    <v-divider
      style="background: lightslategrey"
      vertical
    />
    <v-col
      cols="7"
    >
      <span class="body-2 mr-4">
        Assigned to:
      </span>
      <user-select />
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';
import userSelectChip from './userSelectChip.vue';

export default {
  name: 'TopSection',
  components: {
    userSelect: userSelectChip,
  },
  computed: {
    ...mapState({
      ticket: 'currentTicket',
    }),
  },
};
</script>

<style scoped>
.horiz-line {
  display: inline-block;
  vertical-align: super;
  border-bottom: 2px solid #fafafa;
  padding: 0 30px;
}
</style>
