<template>
  <v-row
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
</template>
<script>
import USColumnStart from './Columns/USColumnStart.vue';
import USColumnEnd from './Columns/USColumnEnd.vue';
import SPColumnMiddle from './Columns/SPColumnMiddle.vue';

export default {
  name: 'UserStoryRows',
  components: {
    'sprints-column': SPColumnMiddle,
    'start-column': USColumnStart,
    'done-column': USColumnEnd,
  },
  props: {
    story: {
      type: Object,
      required: true,
    },
  },

};
</script>

<style scoped>
.columns {
  /*height: 100%;*/
}
</style>
