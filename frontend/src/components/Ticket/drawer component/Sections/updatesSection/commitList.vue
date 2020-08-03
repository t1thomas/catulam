<template>
  <v-card
    flat
    class="tab-content"
  >
    <v-content class="comment-list">
      <v-list
        dense
      >
        <v-list-item v-if="commits.length === 0">
          <v-list-item-content>
            <v-list-item-title>No commits Found</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="comm in commits"
          v-else
          :key="comm.id"
          dense
        >
        </v-list-item>
      </v-list>
    </v-content>
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
import { mapGetters } from 'vuex';

export default {
  name: 'CommitList',
  computed: {
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
    ...mapGetters([
      'getGravatar',
      'getCurrentUser',
    ]),
    commits() {
      const { commits } = this.ticket;
      return commits.sort((a, b) => a.timestamp - b.timestamp);
    },
    editing() {
      return this.text.length === 0;
    },
  },
};
</script>

<style scoped>
.tab-content {
  height: 100%;
  display: grid;
  grid-template-rows: 25vh auto;
}
.comment-list {
  min-height: 100%;
  max-height: 100%;
  overflow-y: auto;
  background-color: #2d2d2d;
}
</style>
