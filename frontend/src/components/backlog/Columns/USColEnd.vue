<template>
  <v-card height="100%">
    <draggable-tick-list
      :list-properties="tickListConfig"
      :ticket-ids="tickIds"
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
      if (this.noUs) {
        return {
          userStoryId: null,
          columnType: 'end',
          disabled: true,
        };
      }
      return {
        userStoryId: this.userStoryId,
        columnType: 'end',
        disabled: true,
      };
    },
    tickIds() {
      if (this.noUs) {
        return this.tickIdsNoUs;
      }
      return this.tickIdsUs(this.userStoryId);
    },
    ...mapGetters({
      tickIdsUs: 'getDoneTicksUs',
      tickIdsNoUs: 'getDoneTicksNoUs',
    }),
  },
};
</script>

<style scoped>

</style>
