<template>
  <q-item
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
        <span class="text-weight-medium">{{ ticket.title }}</span>
        <span class="text-grey-8 q-ml-auto">#{{ ticket.issueNumber }}</span>
      </q-card-section>
      <q-card-section
        horizontal
        class="q-px-sm"
      >
        <q-item-label
          caption
          lines="2"
        >
          {{ ticket.desc }}
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
          {{ ticket.hourEstimate }}hr
        </q-chip>
        <q-avatar size="21px">
          <img src="@/assets/avatar/scientist.svg">
        </q-avatar>
      </q-card-section>
    </q-card>
  </q-item>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'QItemTicketQcard',
  props: {
    ticketId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      'getTicketById',
    ]),
    ticket() {
      return this.getTicketById(this.ticketId);
    },
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
</style>
