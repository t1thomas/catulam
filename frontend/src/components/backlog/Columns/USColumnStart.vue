<template>
  <v-card height="100%">
    <div
      class="d-flex flex-no-wrap"
      style="height: 100%"
    >
      <v-col
        cols="4"
      >
        <v-card-subtitle class="pa-0">
          {{ story.storyText }}
        </v-card-subtitle>
      </v-col>
      <v-col class="pa-0">
        <!-- Pass ids of unstaged tickets of current userStory -->
        <draggable-tick-list
          :list-properties="tickListConfig"
          :ticket-ids="unStagedTickIds()"
        />
      </v-col>
    </div>
  </v-card>
</template>

<script>

import { mapGetters } from 'vuex';
import DraggableTickList from '../DraggableTickList.vue';

export default {
  name: 'USColumnStart',
  components: {
    DraggableTickList,
  },
  props: {
    userStoryId: {
      type: String,
      required: true,
    },
  },
  computed: {
    story() {
      return this.getStoryById(this.userStoryId);
    },
    tickListConfig() {
      return { userStoryId: this.userStoryId, columnType: 'start', disabled: false };
    },
    // tickets in 'to Do'
    ...mapGetters([
      'getStoryById',
      'getUnStagedTicks',
    ]),
  },
  methods: {
    unStagedTickIds() {
      return this.getUnStagedTicks(this.userStoryId);
    },
  },
};
</script>

<style scoped>

</style>
