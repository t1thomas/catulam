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
        <start-column :user-story-id="id" />
      </v-col>
      <v-col
        class="columns fill-height"

        cols="4"
      >
        <sprints-column :user-story-id="id" />
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
import { mapActions, mapGetters } from 'vuex';
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
  },
  methods: {
    ...mapActions([
      'nUStoryDialogShow',
    ]),
    print() {
      console.log(this.rows);
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
