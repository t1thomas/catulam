<template>
  <q-card
    bordered
    style="height: 100%;"
  >
    <q-card-section
      horizontal
      class="q-pa-xs"
      style="height: 100%;"
    >
      <draggable-tick-list :tickets="tickets" />
    </q-card-section>
  </q-card>
</template>

<script>
import DraggableTickList from '../../DraggableTickList.vue';

export default {
  name: 'USColumnEnd',
  components: {
    DraggableTickList,
  },
  props: {
    tickets: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>

</style>
