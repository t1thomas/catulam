<template>
  <v-card height="100%">
    <div
      class="d-flex flex-no-wrap"
      style="height: 100%"
    >
      <v-col
        cols="4"
      >
        <v-card-subtitle
          v-if="!noUs"
          class="pa-0"
        >
          {{ storyById(userStoryId).storyText }}
        </v-card-subtitle>
        <v-card-subtitle
          v-else
          class="pa-0"
        >
          No User Story
        </v-card-subtitle>
      </v-col>
      <v-col class="pa-0">
        <draggable-tick-list
          v-if="!noUs"
          :list-properties="tickListConfig"
          :ticket-ids="tickIds(userStoryId)"
        />
        <draggable-tick-list
          v-else
          :list-properties="tickListConfig"
          :ticket-ids="tickIdsNoUs"
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
    noUs() {
      return this.userStoryId === 'noUs';
    },
    tickListConfig() {
      if (!this.noUs) {
        return {
          userStoryId: this.userStoryId,
          columnType: 'start',
          disabled: false,
        };
      }
      return {
        userStoryId: null,
        columnType: 'start',
        disabled: false,
      };
    },
    ...mapGetters({
      storyById: 'getStoryById',
      tickIds: 'getTicksUsNoSp',
      tickIdsNoUs: 'getTicksNoUsNoSp',
    }),
  },
};
</script>

<style scoped>

</style>
