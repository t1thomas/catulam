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
      <draggable
        tag="div"
        v-bind="dragOptions"
        class="rounded-borders q-list q-list--bordered"
        style="background: cadetblue; width: 100%"
      >
        <QItemticketCard
          v-for="ticketID in CompletedTickIds(attachedTics)"
          :key="ticketID"
          :ticket-id="ticketID"
        />
      </draggable>
    </q-card-section>
  </q-card>
</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';
import backlogTicketQcard from '../../QItemTicketQcard.vue';

export default {
  name: 'USColumnEnd',
  components: {
    draggable,
    // eslint-disable-next-line vue/no-unused-components
    QItemticketCard: backlogTicketQcard,
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
    dragOptions() {
      return {
        animation: 0,
        group: 'ticket',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
  },
};
</script>

<style scoped>

</style>
