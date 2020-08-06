<template>
  <div
    class="containers overflow-y-auto"
    style="height: 80vh"
  >
    <v-row
      v-for="id in rows"
      :key="id"
      no-gutters
      class="mb-0"
    >
      <v-col
        class="columns fill-height"
        cols="5"
      >
        <start-column
          :user-story-id="id"
          @ticketMove="resolveMove"
        />
      </v-col>
      <v-col
        class="columns fill-height"

        cols="4"
      >
        <sprints-column
          :user-story-id="id"
          @ticketMove="resolveMove"
        />
      </v-col>
      <v-col
        class="columns fill-height"

        cols="3"
      >
        <done-column :user-story-id="id" />
      </v-col>
    </v-row>
    <v-row
      v-if="rows.length <= 1"
      no-gutters
    >
      <not-found-card
        type="UStory"
        @createAction="nUStoryDialogShow({ show: true })"
      />
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import SPColumnMiddle from './Columns/SPColMid.vue';
import USColumnStart from './Columns/USColStart.vue';
import USColumnEnd from './Columns/USColEnd.vue';
import NotFoundCard from '../NotFoundCard.vue';

export default {
  name: 'UStoryRows',
  components: {
    'sprints-column': SPColumnMiddle,
    'start-column': USColumnStart,
    'done-column': USColumnEnd,
    NotFoundCard,
  },
  computed: {
    ...mapGetters([
      'genUStoryRowsByPro',
    ]),
    proId() {
      return this.$route.query.proId;
    },
    rows() {
      let rows = this.genUStoryRowsByPro(this.proId);
      const firstEl = 'noUs';
      rows = [firstEl, ...rows];
      return rows;
    },
    ...mapState({
      ticketId: (state) => state.backlogTicMove.ticketId,
      evt: (state) => state.backlogTicMove.evt,
      addedTo: (state) => state.backlogTicMove.addedTo,
      removedFrom: (state) => state.backlogTicMove.removedFrom,
    }),
  },
  methods: {
    ...mapActions([
      'nUStoryDialogShow',
    ]),
    resolveMove() {
      // fromData and toData remains null if ticket is not moved between diff lists
      if (this.removedFrom !== null || this.addedTo !== null) {
        switch (true) {
          case this.removedFrom.userStoryId === this.addedTo.userStoryId:
            /* if userStoryID is same for either addedTo or removedFrom the
               ticket is being moved to/from start or sprint unassigned ticket list */
            this.toStartOrSprint();
            break;
          default:
            break;
        }
      }
    },
    async toStartOrSprint() {
      if (this.removedFrom.columnType === 'start' && this.addedTo.columnType === 'sprint') {
        const payload = {
          tick: { id: this.ticketId },
          sprintAdd: { id: this.addedTo.sprintId },
        };
        await this.$store.dispatch('startToSprint', payload);
      } else if (this.removedFrom.columnType === 'sprint' && this.addedTo.columnType === 'start') {
        const payload = {
          tick: { id: this.ticketId },
          sprintRemove: { id: this.removedFrom.sprintId },
        };
        await this.$store.dispatch('sprintToStart', payload);
      }
    },
  },
};
</script>

<style scoped>
.containers {
  width: 100%;
  grid-gap: 10px;
  display: grid;
  grid-auto-rows: 12rem;
}
</style>
