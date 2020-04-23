<template>
  <div
    class="containers"
  >
    <v-row>
      <v-col
        cols="2"
        class="pb-0"
      >
        <unassigned-ticks />
      </v-col>
      <v-col
        cols="10"
        class="pl-0"
        style="overflow-y: auto; max-height: 89vh"
      >
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
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import USColumnStart from './Columns/USColumnStart.vue';
import USColumnEnd from './Columns/USColumnEnd.vue';
import SPColumnMiddle from './Columns/SPColumnMiddle.vue';
import unassignedTicks from './Columns/unassignedTicks.vue';

export default {
  name: 'UserStoryRows',
  components: {
    'sprints-column': SPColumnMiddle,
    'start-column': USColumnStart,
    'done-column': USColumnEnd,
    unassignedTicks,
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
    width: 100%;
    display: grid;
    grid-template-rows: auto;
  }
</style>
