<template>
  <v-card flat class="tab-content">
    <v-card-text>Commits</v-card-text>
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
};
</script>

<style scoped>
  .tab-content {
    height: inherit;
    display: grid;
    max-width: 34vw;
    grid-template-rows: 80% auto;
  }
</style>
