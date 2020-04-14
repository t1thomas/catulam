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
          {{ getUserStoryText(userStoryId) }}
        </v-card-subtitle>
      </v-col>
      <v-divider vertical />
      <v-col class="pa-0">
        <!-- Pass ids of unstaged tickets of current userStory -->
        <draggable-tick-list
          :list-properties="tickListConfig"
          :ticket-ids="getUnStagedTicks(userStoryId)"
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
    tickListConfig() {
      return { userStoryId: this.userStoryId, columnType: 'start', disabled: false };
    },
    ...mapGetters([
      'getUnStagedTicks',
      'getUserStoryText',
    ]),
  },
};
</script>

<style scoped>

</style>
