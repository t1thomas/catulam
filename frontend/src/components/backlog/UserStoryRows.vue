<template>
  <div class="containers">
    <v-row
      class="mb-2"
      no-gutters
    >
      <v-col
        class="columns"
        cols="5"
      >
        <start-column user-story-id="noUs" />
      </v-col>
      <v-col
        class="columns"

        cols="4"
      >
        <sprints-column user-story-id="noUs" />
      </v-col>
      <v-col
        class="columns"

        cols="3"
      >
        <done-column user-story-id="noUs" />
      </v-col>
    </v-row>
    <v-row
      v-for="story in stories"
      :key="story.id"
      class="mb-2"
      no-gutters
    >
      <v-col
        class="columns"
        cols="5"
      >
        <start-column :user-story-id="story.id" />
      </v-col>
      <v-col
        class="columns"

        cols="4"
      >
        <sprints-column
          :user-story-id="story.id"
        />
      </v-col>
      <v-col
        class="columns"

        cols="3"
      >
        <done-column
          :user-story-id="story.id"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import USColumnStart from './Columns/USColStart.vue';
import USColumnEnd from './Columns/USColEnd.vue';
import SPColumnMiddle from './Columns/SPColMid.vue';
import unassignedTicks from './Columns/unassignedTicks.vue';

export default {
  name: 'BoardRows',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    'sprints-column': SPColumnMiddle,
    'start-column': USColumnStart,
    // eslint-disable-next-line vue/no-unused-components
    'done-column': USColumnEnd,
    // eslint-disable-next-line vue/no-unused-components
    unassignedTicks,
  },
  computed: {
    ...mapState({
      stories: (state) => state.currProElements.userStories,
    }),
  },
};
</script>

<style scoped>
  .containers {
    width: 100%;
    display: grid;
    grid-template-rows: auto;
  }
</style>
