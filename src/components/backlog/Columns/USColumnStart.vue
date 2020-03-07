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
        {{ userStory.storyText }}
      </q-card-section>
      <q-separator vertical />
      <q-card-section class="col q-pa-xs">
        <draggable-tick-list :ticket-ids="UnCompleteTickIds(userStory.attachedTics)" />
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
    userStory: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      UnCompleteTickIds: 'getUnCompleteTickIds',
    }),
    dragOptions() {
      return {
        animation: 0,
        group: 'ticket',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
  },
};
</script>

<style scoped>
.thendi {
  flex-wrap: nowrap;
}
</style>
