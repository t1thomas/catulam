<template>
  <draggable
    tag="div"
    v-bind="dragOptions"
    class="rounded-borders q-list q-list--bordered"
    style="background: cadetblue; width: 100%; height: 100%;"
  >
    <q-item
      v-for="ticketID in ticketIds"
      :key="ticketID"
      v-ripple
      class="q-pa-none q-ma-sm"
      clickable
    >
      <q-card
        style="height: 4.5rem;"
      >
        <q-card-section
          horizontal
          class="q-pl-sm q-pr-xs"
        >
          <span class="text-weight-medium">{{ getTicketById(ticketID).title }}</span>
          <span class="text-grey-8 q-ml-auto">#{{ getTicketById(ticketID).issueNumber }}</span>
        </q-card-section>
        <q-card-section
          horizontal
          class="q-px-sm"
        >
          <q-item-label
            caption
            lines="2"
          >
            {{ getTicketById(ticketID).desc }}
          </q-item-label>
        </q-card-section>
        <q-card-section
          class="q-px-xs q-pb-xs q-gutter-xs"
          horizontal
          style="place-content: flex-end;"
        >
          <q-chip
            dense
            icon="mdi-progress-clock"
          >
            {{ getTicketById(ticketID).hourEstimate }}hr
          </q-chip>
          <q-avatar size="21px">
            <img src="@/assets/avatar/scientist.svg">
          </q-avatar>
        </q-card-section>
      </q-card>
    </q-item>
  </draggable>
</template>

<script>

import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';

export default {
  name: 'DraggableTickList',
  components: {
    draggable,
  },
  apollo: {

  },
  props: {
    ticketIds: {
      type: Array,
      required: true,
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: 'ticket',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
    ...mapGetters([
      'getTicketById',
    ]),
  },
};
</script>

<style scoped>
  ::selection {
    color: none;
    background: none;
  }
  /* For Mozilla Firefox */
  ::-moz-selection {
    color: none;
    background: none;
  }
  /*.ghost {*/
  /*  opacity: 0.5;*/
  /*  background: #7678fb;*/
  /*}*/
</style>
