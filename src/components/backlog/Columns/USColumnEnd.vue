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
      <draggable-tick-list :ticket-ids="CompletedTickIds(attachedTics)" />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex';
import DraggableTickList from '../../DraggableTickList.vue';

export default {
  name: 'USColumnEnd',
  components: {
    DraggableTickList,
  },
  props: {
    attachedTics: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      CompletedTickIds: 'getCompletedTickIds',
    }),
  },
};
</script>

<style scoped>

</style>
