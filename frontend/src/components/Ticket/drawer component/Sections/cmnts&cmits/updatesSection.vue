<template>
  <v-tabs
    v-model="tab"
    color="white"
    class="elevation-2"
    centered
    grow
  >
    <v-tab>
      <v-icon left>
        mdi-comment-text-multiple
      </v-icon>
      Comments (3)
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
    ...mapGetters([
      'getGravatar',
      'getCurrentUser',
    ]),
  },
};
</script>

<style scoped>
  .v-window__container {
    height: 100%
  }
</style>
