<template>
  <v-container>
    <span class="headline">
      #{{ ticket.issueNumber }}
      {{ ticket.title }}
    </span>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TopSection',
  computed: {
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
  },
};
</script>

<style scoped>

</style>
