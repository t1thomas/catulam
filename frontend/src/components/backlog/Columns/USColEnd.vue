<template>
  <v-card height="100%">
    <draggable
      tag="div"
      v-bind="dragOptions"
      class="v-list v-list--dense"
      style="background: #17429b66; width: 100%; height: 100%; overflow-y: auto"
    >
      <ticket-card-slim
        v-for="id in tickIds"
        :key="id"
        :tick-id="id"
      />
    </draggable>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import ticketCardSlim from '@/components/Ticket/card/ticketCardSlim.vue';

export default {
  name: 'USColumnEnd',
  components: {
    draggable,
    ticketCardSlim,
  },
  props: {
    userStoryId: {
      type: String,
      required: true,
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'ticketList',
        disabled: true,
        ghostClass: 'ghost',
      };
    },
    noUs() {
      return this.userStoryId === 'noUs';
    },
    listProperties() {
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
