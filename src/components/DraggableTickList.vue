<template>
  <draggable
    ref="thendi"
    v-model="tickList"
    tag="div"
    v-bind="dragOptions"
    class="rounded-borders q-list q-list--bordered"
    style="background: cadetblue; width: 100%; height: 100%;"
    :move="checkMove"
    @remove="removed(listConfig)"
    @add="added(listConfig)"
    @end="ended"
  >
    <q-item
      v-for="ticket in tickList"
      :key="ticket.id"
      v-ripple
      :item-id="ticket.id"
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
          <span class="text-weight-medium">{{ getTicketById(ticket.id).title }}</span>
          <span class="text-grey-8 q-ml-auto">#{{ getTicketById(ticket.id).issueNumber }}</span>
        </q-card-section>
        <q-card-section
          horizontal
          class="q-px-sm"
        >
          <q-item-label
            caption
            lines="2"
          >
            {{ getTicketById(ticket.id).desc }}
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
            {{ getTicketById(ticket.id).hourEstimate }}hr
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

import { mapGetters, mapActions, mapState } from 'vuex';
import draggable from 'vuedraggable';

export default {
  name: 'DraggableTickList',
  components: {
    draggable,
  },
  props: {
    tickets: {
      type: Array,
      required: true,
    },
    listConfig: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tickList: this.tickets,
      isDragging: false,
      from: null,
      to: null,
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'ticketList',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
    ...mapGetters([
      'getTicketById',
    ]),
    ...mapState([
      'cardMoved',
    ]),
  },
  methods: {
    ...mapActions([
      'setCardRemoved',
      'setCardAdded',
      'clearCardRemNAdd',
    ]),
    checkMove() {
      return this.listConfig.columnType !== 'end';
    },
    removed(listConfig) {
      this.setCardRemoved(listConfig);
    },
    added(listConfig) {
      this.setCardAdded(listConfig);
    },
    ended(evt) {
      const tickId = evt.item.getAttribute('item-id');
      const expr = 'Papayas';
      switch (true) {
        case this.cardMoved.removedFrom.columnType === 'start' && this.cardMoved.removedFrom.columnType === 'sprint':
          this.fromStartToSprint(tickId);
          break;
        case 'Mangoes':
        case 'Papayas':
          console.log('Mangoes and papayas are $2.79 a pound.');
          // expected output: "Mangoes and papayas are $2.79 a pound."
          break;
        default:
          console.log(`Sorry, we are out of ${expr}.`);
      }
    },
    fromStartToSprint(tickId) {
        //get network changes working first then worry about vuex mutation
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
  /*.ghost {*/
  /*  opacity: 0.5;*/
  /*  background: #7678fb;*/
  /*}*/
</style>
