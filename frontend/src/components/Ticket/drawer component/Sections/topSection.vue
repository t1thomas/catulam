<template>
  <v-container>
    <v-row>
      <span class="headline">
        #{{ ticket.issueNumber }}
        {{ ticket.title }}
      </span>
    </v-row>
    <v-row>
      <v-col
        cols="6"
      >
        Assigned to:
      </v-col>
      <v-col
        cols="6"
      >
        <user-select />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import userSelectChip from './userSelectChip.vue';

export default {
  name: 'TopSection',
  components: {
    userSelect: userSelectChip,
  },
  computed: {
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
  },
};
</script>

<style scoped>

</style>
