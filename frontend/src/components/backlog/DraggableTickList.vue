<template>
  <v-sheet style="height: 100%">
    <USDialog
      v-if="showUSDialog"
      @confirm="confirmUSSwitch"
      @cancel="cancelMove"
    />
    <draggable
      tag="div"
      v-bind="dragOptions"
      class="v-list"
      style="background: rgb(39, 54, 102); width: 100%; height: 100%;"
      @end="ended"
      @add="onAdd"
      @remove="onRemove"
    >
      <v-list-item
        v-for="tickId in ticketIds"
        :id="tickId"
        :key="tickId"
        v-ripple
        class="pa-0 ma-sm-1"
        clickable
      >
        <ticket-card-slim :tick-id="tickId" />
      </v-list-item>
    </draggable>
  </v-sheet>
</template>

<script>

import { mapActions, mapState } from 'vuex';
import draggable from 'vuedraggable';
import Vue from 'vue';
import gqlQueries from '../../graphql/gql-queries';
import USDialog from './Columns/USDialog.vue';
import ticketCardSlim from './ticketCardSlim.vue';

export default {
  name: 'DraggableTickList',
  components: {
    draggable,
    USDialog,
    ticketCardSlim,
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
    columnType() {
      return this.listProperties.columnType;
    },
    dragOptions() {
      return {
        animation: 200,
        group: 'ticketList',
        disabled: this.listProperties.disabled,
        ghostClass: 'ghost',
      };
    },
    ...mapState([
      'changeDialog',
    ]),
    showUSDialog() {
      return this.changeDialog.showUSDialog;
    },
    removedFrom() {
      return this.changeDialog.removedFrom;
    },
    addedTo() {
      return this.changeDialog.addedTo;
    },
    proId() {
      return this.$route.query.proId;
    },
  },
  methods: {
    ...mapActions([
      'fetchBackLogData',
      'fetchSprints',
      'uSCDRemovedFrom',
      'uSCDAddedTo',
      'uSCDTicketId',
      'uSCDEvt',
      'USDialogSwitcher',
      'UADialogSwitcher',
    ]),
    onRemove() {
      // mutate store
      console.log('removed');
      this.uSCDRemovedFrom(this.listProperties);
    },
    onAdd() {
      // mutate store
      console.log('added');
      this.uSCDAddedTo(this.listProperties);
    },
    ended(evt) {
      this.ticketMoveResolve(evt);
    },
    ticketMoveResolve(evt) {
      const tickId = evt.item.id;
      const fromData = this.removedFrom;
      const toData = this.addedTo;
      // fromData and toData remains undefined if ticket is not moved between diff lists
      if (fromData !== undefined || toData !== undefined) {
        if (fromData.userStoryId === null || toData.userStoryId === null) {
          /* if userStoryId === null for either toData or fromData the
         ticket is being moved to/from unassigned ticket list */
          this.switchUADialog(evt);
        } else {
          switch (true) {
            case fromData.userStoryId !== toData.userStoryId:
              this.switchUSDialog(evt);
              break;
            case fromData.columnType === 'start' && toData.columnType === 'sprint':
              this.startToSprint(tickId, toData.sprintId);
              break;
            case fromData.columnType === 'sprint' && toData.columnType === 'start':
              this.sprintToStart(tickId, fromData.sprintId);
              break;
            default:
              break;
          }
        }
      }
    },
    switchUADialog(evt) {
      console.log(evt);
      console.log('hr');
      const tickId = evt.item.id;
      this.uSCDTicketId(tickId);
      this.uSCDEvt(evt);
      this.UADialogSwitcher();
    },
    switchUSDialog(evt) {
      const tickId = evt.item.id;
      this.uSCDTicketId(tickId);
      this.uSCDEvt(evt);
      this.USDialogSwitcher();
    },
    confirmUSSwitch(args) {
      const { ticketId } = this.changeDialog;
      const { evt } = this.changeDialog;

      switch (args.action) {
        case 1:
          this.uStorySwitchOnly(ticketId, evt);
          break;
        case 2:
          this.uStorySwitchAddNewSprint(ticketId, evt, args.sprintId);
          break;
        case 3:
          this.uStorySwitchRemoveSprint(ticketId, evt);
          break;
        case 4:
          this.uStorySwitchChangeSprint(ticketId, evt, args.sprintId);
          break;
        default:
          this.uStorySwitchOnly(ticketId, evt);
          break;
      }
    },
    confirmUASwitch(args) {
      switch (args.action) {
        case 1:
          this.addNewUS(); // TESTED
          break;
        case 2:
          this.addNewUSNewSp(args.sprintId); // TESTED
          break;
        case 3:
          this.remUS(); // TESTED
          break;
        default:
          this.remUSRemSP(); // TESTED
          break;
      }
    },
    cancelMove() {
      const { evt } = this.changeDialog;
      this.switchBack(evt);
    },
    async uStorySwitchOnly(ticketId, evt) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUserStory.storySwitch,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: ticketId,
          usFrom: this.removedFrom.userStoryId,
          usTo: this.addedTo.userStoryId,
        },
      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
        this.switchBack(evt);
      });
    },
    async uStorySwitchAddNewSprint(ticketId, evt, sprintAddId) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUserStory.AddNewSprint,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: { id: ticketId },
          sprintAdd: { id: sprintAddId },
          uStoryRemove: { id: this.removedFrom.userStoryId },
          uStoryAdd: { id: this.addedTo.userStoryId },
        },

      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
        this.switchBack(evt);
      });
    },
    async uStorySwitchRemoveSprint(ticketId, evt) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUserStory.RemoveSprint,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: { id: ticketId },
          sprintRemove: { id: this.removedFrom.sprintId },
          uStoryRemove: { id: this.removedFrom.userStoryId },
          uStoryAdd: { id: this.addedTo.userStoryId },
        },

      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
        this.switchBack(evt);
      });
    },
    // yet to be tested
    async uStorySwitchChangeSprint(ticketId, evt, sprintAddId) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUserStory.ChangeSprint,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: { id: ticketId },
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
        this.switchBack(evt);
      });
    },
    async sprintToStart(ticketId, sprintId) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SprintToStart,
        fetchPolicy: 'no-cache',
        variables: { ticket: { id: ticketId }, sprint: { id: sprintId } },
      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
      });
    },
    switchBack(evt) {
      // remove ticket from new list and put back in old list
      evt.from.insertBefore(evt.to.childNodes[evt.newDraggableIndex],
        evt.from.childNodes[evt.oldDraggableIndex]);
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
      this.fetchBackLogData(this.proId);
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
