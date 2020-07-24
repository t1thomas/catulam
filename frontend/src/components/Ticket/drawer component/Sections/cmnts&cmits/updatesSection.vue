<template>
  <v-tabs
    v-model="tab"
    color="white"
    class="elevation-2 cmns-cmis"
    centered
    grow
  >
    <v-tab>
      <v-icon left>
        mdi-comment-text-multiple
      </v-icon>
      Comments ({{ getTicketComments(ticketId).length }})
    </v-tab>
    <v-tab-item>
      <comment-list />
    </v-tab-item>
    <v-tab>
      <v-icon left>
        mdi-git
      </v-icon>
      Commits (3)
    </v-tab>
    <v-tab-item>
      <commit-list />
    </v-tab-item>
  </v-tabs>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import commentList from './commentList.vue';
import commitList from './commitList.vue';

export default {
  name: 'UpdatesSection',
  components: {
    commentList,
    commitList,
  },
  data: () => ({
    tab: null,
  }),
  computed: {
    ...mapState({
      ticketId: (state) => state.detailsDrawer.ticketId,
    }),
    ...mapGetters([
      'getCurrentUser',
      'getTicketComments',
    ]),
  },
  mounted() {
    console.log(this.getTicketComments(this.ticketId));
  },
};
</script>

<style scoped>

</style>
