<template>
  <v-container fluid>
    <v-tabs
      v-model="tab"
      color="white"
      centered
      grow
    >
      <v-tab>
        <v-icon left>
          mdi-comment-text-multiple
        </v-icon>
        Comments ({{ ticket.comments.length }})
      </v-tab>
      <v-tab-item>
        <comment-list />
      </v-tab-item>
      <v-tab>
        <v-icon left>
          mdi-git
        </v-icon>
        Commits ({{ ticket.commits.length }})
      </v-tab>
      <v-tab-item>
        <commit-list />
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
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
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
  },
};
</script>

<style scoped>

</style>
