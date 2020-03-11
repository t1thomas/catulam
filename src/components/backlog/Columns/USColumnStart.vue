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
        {{ story.storyText }}
      </q-card-section>
      <q-separator vertical />
      <q-card-section class="col q-pa-xs">
        <draggable-tick-list
          :list-config="tickListConfig"
          :tickets="UnStagedTicks(story.tickets)"
        />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>

import DraggableTickList from '../../DraggableTickList.vue';

export default {
  name: 'USColumnStart',
  components: {
    DraggableTickList,
  },
  props: {
    story: {
      type: Object,
      required: true,
    },
  },
  computed: {
    tickListConfig() {
      return { userStoryId: this.userStoryId, columnType: 'start' };
    },
  },
  methods: {
    UnStagedTicks(tickets) {
      return tickets
        .filter(tick => tick.done === false
          && (tick.sprint === null));
    },
  },
};
</script>

<style scoped>
.thendi {
  flex-wrap: nowrap;
}
</style>
