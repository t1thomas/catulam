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
        {{ userStory.storyText }}
      </q-card-section>
      <q-separator vertical />
      <q-card-section class="col q-pa-xs">
        <draggable
          tag="div"
          v-bind="dragOptions"
          class="rounded-borders q-list q-list--bordered"
          style="background: cadetblue; height: 100%;"
        >
          <QItemticketCard
            v-for="ticketID in UnCompleteTickIds(userStory.attachedTics)"
            :key="ticketID"
            :ticket-id="ticketID"
          />
        </draggable>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';

import backlogTicketQcard from '../../QItemTicketQcard.vue';

export default {
  name: 'USColumnStart',
  components: {
    draggable,
    QItemticketCard: backlogTicketQcard,
  },
  props: {
    userStory: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      UnCompleteTickIds: 'getUnCompleteTickIds',
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
.thendi {
  flex-wrap: nowrap;
}
</style>
