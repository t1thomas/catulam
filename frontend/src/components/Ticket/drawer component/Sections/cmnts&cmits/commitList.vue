<template>
  <v-card
    flat
    class="tab-content"
  >
    <v-card-text class="commit-list pa-0">
      <span
        v-if="commits.length === 0"
        class="not-found"
      > No commits Found</span>
    </v-card-text>
    <v-card-actions>
      <v-btn small>
        Add Commit
        <v-icon
          small
          right
          dark
        >
          mdi-git
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'CommitList',
  data: () => ({
    commits: [],
  }),
};
</script>

<style scoped>
  .tab-content {
    height: inherit;
    display: grid;
    max-width: 34vw;
    grid-auto-rows: 75% auto;
  }
  .commit-list {
    min-height: 100%;
    max-height: 100%;
    overflow-y: auto;
    background-color: #3e3e3e;
  }
</style>
