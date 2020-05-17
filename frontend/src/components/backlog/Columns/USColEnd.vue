<template>
  <v-card height="100%">
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
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import DraggableTickList from '../DraggableTickList.vue';

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
    noUs() {
      return this.userStoryId === 'noUs';
    },
    tickListConfig() {
      if (!this.noUs) {
        return {
          userStoryId: this.userStoryId,
          columnType: 'end',
          disabled: true,
        };
      }
      return {
        userStoryId: null,
        columnType: 'end',
        disabled: true,
      };
    },
    ...mapGetters({
      tickIds: 'getDoneTicksUs',
      tickIdsNoUs: 'getDoneTicksNoUs',
    }),
  },
};
</script>

<style scoped>

</style>
