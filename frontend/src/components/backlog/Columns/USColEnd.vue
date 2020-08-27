<template>
  <v-card height="100%">
    <draggable
      tag="div"
      v-bind="dragOptions"
      class="v-list v-list--dense"
      style="background: #17429b66; width: 100%; height: 100%; overflow-y: auto"
    >
      <ticket-card-slim
        v-for="tick in tickets"
        :key="tick.id"
        :ticket="tick"
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
    proId() {
      return this.$route.query.proId;
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
    tickets() {
      if (this.noUs) {
        return this.ticksNoUs(this.proId);
      }
      return this.ticksUs(this.userStoryId, this.proId);
    },
    ...mapGetters({
      ticksUs: 'getDoneTicksUs',
      ticksNoUs: 'getDoneTicksNoUs',
    }),
  },
};
</script>

<style scoped>

</style>
