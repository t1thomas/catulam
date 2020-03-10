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
        {{ storyText }}
      </q-card-section>
      <q-separator vertical />
      <q-card-section class="col q-pa-xs">
        <draggable-tick-list :tickets="tickets" />
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
    storyText: {
      type: String,
      required: true,
    },
    tickets: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.thendi {
  flex-wrap: nowrap;
}
</style>
