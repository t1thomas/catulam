<template>
  <div
    class="containers"
  >
    <v-row
      v-for="story in stories"
      :key="story.id"
      class="mb-2"
      no-gutters
      style="max-height: 100%"
    >
      <v-col
        class="columns"
        cols="4"
      >
        <start-column :user-story-id="story.id" />
      </v-col>
      <v-col
        class="columns"

        cols="5"
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
import USColumnStart from './Columns/USColumnStart.vue';
import USColumnEnd from './Columns/USColumnEnd.vue';
import SPColumnMiddle from './Columns/SPColumnMiddle.vue';

export default {
  name: 'UserStoryRows',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    'sprints-column': SPColumnMiddle,
    'start-column': USColumnStart,
    // eslint-disable-next-line vue/no-unused-components
    'done-column': USColumnEnd,
  },
  computed: {
    ...mapState({
      stories: (state) => state.backLogData.userStories,
    }),
  },
};
</script>

<style scoped>
  .containers {
    height: 100%;
    display: grid;
    grid-template-rows: auto;
  }
</style>
