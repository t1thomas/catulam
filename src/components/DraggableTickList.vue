<template>
  <draggable
    tag="div"
    v-bind="dragOptions"
    class="rounded-borders q-list q-list--bordered"
    style="background: cadetblue; width: 100%; height: 100%;"
    @end="ended"
    @add="onAdd"
    @remove="onRemove"
  >
    <q-item
      v-for="ticketId in ticketIds"
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
// eslint-disable-next-line no-unused-vars
import UserStorySwitchDialog from './backlog/Columns/UserStorySwitchDialog.vue';

export default {
  name: 'DraggableTickList',
  components: {
    draggable,
  },
  props: {
    ticketIds: {
      type: Array,
      required: true,
    },
    listProperties: {
      type: Object,
      required: true,
    },
  },
  computed: {
    listData() {
      return this.listProperties;
    },
    dragOptions() {
      return {
        animation: 200,
        group: 'ticketList',
        disabled: this.listProperties.disabled,
        ghostClass: 'ghost',
      };
    },
    ...mapGetters([
      'getTicketById',
    ]),
    ...mapState([
      'removedFrom',
      'addedTo',
    ]),
  },
  methods: {
    ...mapActions([
      'fetchBackLogData',
      'fetchSprints',
      'setRemovedFrom',
      'setAddedTo',
    ]),
    onRemove() {
      // mutate store
      this.setRemovedFrom(this.listProperties);
    },
    onAdd() {
      // mutate store
      this.setAddedTo(this.listProperties);
    },
    ended(evt) {
      console.log(evt);
      // eslint-disable-next-line no-underscore-dangle
      const fromData = this.removedFrom;
      // eslint-disable-next-line no-underscore-dangle
      const toData = this.addedTo;
      const tickId = evt.item.id;
      console.log(fromData);
      console.log(toData);
      // const fromData = JSON.parse(evt.from.getAttribute('data-prop'));
      // const toData = JSON.parse(evt.to.getAttribute('data-prop'));
      switch (true) {
        case fromData.userStoryId !== toData.userStoryId:
          this.$q.dialog({
            component: UserStorySwitchDialog,
            parent: this,
            ticketId: tickId,
          }).onOk(() => {
            // some shit
          }).onDismiss((msg) => {
            if (msg === 'okay') {
              console.log('okay');
            } else {
              this.switchBack(evt.from, evt.oldDraggableIndex, evt.to, evt.newDraggableIndex);
            }
          });
          break;
        case fromData.columnType === 'start' && toData.columnType === 'sprint':
          this.startToSprint(tickId, toData.sprintId);
          break;
        case fromData.columnType === 'sprint' && toData.columnType === 'start':
          this.sprintToStart(tickId, fromData.sprintId);
          break;
        default:
          console.log('Sorry.');
      }
    },
    switchBack(from, oldIndex, to, newIndex) {
      from.insertBefore(to.childNodes[newIndex], from.childNodes[oldIndex]);
      // to.removeChild(to.childNodes[newIndex]);
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
</style>
