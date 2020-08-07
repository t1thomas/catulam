<template>
  <v-card
    flat
    class="tab-content"
  >
    <v-content class="comment-list">
      <v-list
        v-if="showAddCommit === false"
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
          <commit-card :commit="comm" />
        </v-list-item>
      </v-list>
      <add-commit v-if="showAddCommit" />
    </v-content>
    <v-card-actions
      style="justify-content: flex-end;"
    >
      <v-btn
        small
        @click="showAddCommitOverLay(true)"
      >
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
import { mapGetters, mapActions, mapState } from 'vuex';
import commitCard from './commitCard.vue';
import AddCommit from './AddCommit.vue';

export default {
  name: 'CommitList',
  components: {
    commitCard,
    AddCommit,
  },
  data: () => ({
    overlay: false,
  }),
  computed: {
    ...mapState({
      showAddCommit: (state) => state.addCommitOverLay,
    }),
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
  methods: {
    ...mapActions([
      'showAddCommitOverLay',
    ]),
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
