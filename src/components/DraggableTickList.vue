<template>
  <draggable
    ref="thendi"
    tag="div"
    v-bind="dragOptions"
    :data-prop="listData"
    class="rounded-borders q-list q-list--bordered"
    style="background: cadetblue; width: 100%; height: 100%;"
    :move="checkMove"
    @end="ended"
  >
    <q-item
      v-for="ticketId in tickList"
      :id="ticketId"
      :key="ticketId"
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
          <span class="text-weight-medium">{{ getTicketById(ticketId).title }}</span>
          <span class="text-grey-8 q-ml-auto">#{{ getTicketById(ticketId).issueNumber }}</span>
        </q-card-section>
        <q-card-section
          horizontal
          class="q-px-sm"
        >
          <q-item-label
            caption
            lines="2"
          >
            {{ getTicketById(ticketId).desc }}
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
            {{ getTicketById(ticketId).hourEstimate }}hr
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
import Vue from 'vue';
import gqlQueries from '../graphql/gql-queries';

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
    listProperties: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tickList: this.tickets,
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
    listData() {
      return JSON.stringify(this.listProperties);
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
      'fetchBackLogData',
      'fetchSprints',
    ]),
    checkMove() {
      return this.listProperties.columnType !== 'end';
    },
    ended(evt) {
      const tickId = evt.item.id;
      const from = JSON.parse(evt.from.getAttribute('data-prop'));
      const to = JSON.parse(evt.to.getAttribute('data-prop'));
      switch (true) {
        case from.columnType === 'start' && to.columnType === 'sprint':
          this.startToSprint(tickId, to.sprintId);
          break;
        case from.columnType === 'sprint' && to.columnType === 'start':
          this.sprintToStart(tickId, from.sprintId);
          break;
        case 'Papayas':
          console.log('Mangoes and papayas are $2.79 a pound.');
          // expected output: "Mangoes and papayas are $2.79 a pound."
          break;
        default:
          console.log('Sorry.');
      }
    },
    async startToSprint(tickId, sprintId) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.StartToSprint,
        variables: { ticket: { id: tickId }, sprint: { id: sprintId } },
      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
      });
    },
    updateStore() {
      this.fetchSprints();
      this.fetchBackLogData();
    },
    async sprintToStart(tickId, sprintId) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SprintToStart,
        fetchPolicy: 'no-cache',
        variables: { ticket: { id: tickId }, sprint: { id: sprintId } },
      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
      });
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
