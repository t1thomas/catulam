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
      <draggable-tick-list
        :list-config="tickListConfig"
        :tickets="tickets"
      />
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
    userStoryId: {
      type: String,
      required: true,
    },
    tickets: {
      type: Array,
      required: true,
    },
  },
  computed: {
    tickListConfig() {
      return { userStoryId: this.userStoryId, columnType: 'end' };
    },
  },
};
</script>

<style scoped>

</style>
