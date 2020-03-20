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
      'clearRemAdd',
      'showDialogSwitcher',
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
      this.ticketMoveResolve(evt);
    },
    ticketMoveResolve(evt) {
      const tickId = evt.item.id;
      const fromData = this.removedFrom;
      const toData = this.addedTo;
      console.log(fromData);
      console.log(toData);
      // fromData and toData remains undefined if ticket is not moved between diff lists
      if (fromData !== undefined || toData !== undefined) {
        switch (true) {
          case fromData.userStoryId !== toData.userStoryId:
            this.switchUserStoryDialog(evt);
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
      }
    },
    switchUserStoryDialog(evt) {
      const tickId = evt.item.id;
      this.showDialogSwitcher();
      // Launch dialog
      this.$q.dialog({
        component: UserStorySwitchDialog,
        parent: this,
        ticketId: tickId,
      })
        .onOk((args) => {
          switch (args.action) {
            case 1:
              this.uStorySwitchOnly(tickId, evt);
              break;
            case 2:
              this.uStorySwitchAddNewSprint(tickId, evt, args.sprintId);
              break;
            case 3:
              this.uStorySwitchRemoveSprint(tickId, evt);
              break;
            case 4:
              this.uStorySwitchChangeSprint(tickId, evt, args.sprintId);
              break;
            default:
              this.uStorySwitchOnly(tickId, evt);
              break;
          }
          console.log(args.action);
        })
        .onDismiss((args) => {
          if (args === undefined) {
            this.switchBack(evt.from, evt.oldDraggableIndex, evt.to, evt.newDraggableIndex);
          }
          this.showDialogSwitcher();
        });
    },
    async uStorySwitchOnly(tickId, evt) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUserStory.storySwitch,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: tickId,
          usFrom: this.removedFrom.userStoryId,
          usTo: this.addedTo.userStoryId,
        },
      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
        this.switchBack(evt.from, evt.oldDraggableIndex, evt.to, evt.newDraggableIndex);
      });
      this.clearRemAdd();
    },
    async uStorySwitchAddNewSprint(tickId, evt, sprintAddId) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUserStory.AddNewSprint,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: { id: tickId },
          sprintAdd: { id: sprintAddId },
          uStoryRemove: { id: this.removedFrom.userStoryId },
          uStoryAdd: { id: this.addedTo.userStoryId },
        },

      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
        this.switchBack(evt.from, evt.oldDraggableIndex, evt.to, evt.newDraggableIndex);
      });
      this.clearRemAdd();
    },
    async uStorySwitchRemoveSprint(tickId, evt) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUserStory.RemoveSprint,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: { id: tickId },
          $sprintRemove: { id: this.removedFrom.sprintId },
          uStoryRemove: { id: this.removedFrom.userStoryId },
          uStoryAdd: { id: this.addedTo.userStoryId },
        },

      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
        this.switchBack(evt.from, evt.oldDraggableIndex, evt.to, evt.newDraggableIndex);
      });
      this.clearRemAdd();
    },
    async uStorySwitchChangeSprint(tickId, evt, sprintAddId) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUserStory.ChangeSprint,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: { id: tickId },
          sprintRemove: { id: this.removedFrom.sprintId },
          sprintAdd: { id: sprintAddId },
          uStoryRemove: { id: this.removedFrom.userStoryId },
          uStoryAdd: { id: this.addedTo.userStoryId },
        },
      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
        this.switchBack(evt.from, evt.oldDraggableIndex, evt.to, evt.newDraggableIndex);
      });
      this.clearRemAdd();
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
      this.clearRemAdd();
    },
    switchBack(from, oldIndex, to, newIndex) {
      // remove ticket from new list and put back in old list
      from.insertBefore(to.childNodes[newIndex], from.childNodes[oldIndex]);
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
      this.clearRemAdd();
    },
    updateStore() {
      this.fetchSprints();
      this.fetchBackLogData();
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
