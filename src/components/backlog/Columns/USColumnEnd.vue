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
        :list-properties="tickListConfig"
        :ticket-ids="getCompletedTicks(userStoryId)"
      />
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
    userStoryId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      'getCompletedTicks',
    ]),
    tickListConfig() {
      return { userStoryId: this.userStoryId, columnType: 'end', disabled: true };
    },
  },
};
</script>

<style scoped>

</style>
