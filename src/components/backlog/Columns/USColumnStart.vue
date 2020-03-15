<template>
  <q-card
    bordered
    style="height: 100%;"
  >
    <q-card-section
      horizontal
      style="height: 100%;"
    >
      <q-card-section
        class="col-3 card-text"
      >
        {{ getUserStoryText(userStoryId) }}
      </q-card-section>
      <q-separator vertical />
      <q-card-section class="col q-pa-xs">
        <draggable-tick-list
          :list-properties="tickListConfig"
          :ticket-ids="getUnStagedTicks(userStoryId)"
        />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>

import { mapGetters } from 'vuex';
import DraggableTickList from '../../DraggableTickList.vue';

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
.thendi {
  flex-wrap: nowrap;
}
</style>
