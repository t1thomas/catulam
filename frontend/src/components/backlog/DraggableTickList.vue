<template>
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
      v-for="ticketId in ticketIds"
      :id="ticketId"
      :key="ticketId"
      v-ripple
      class="pa-0 ma-sm-2"
      clickable
    >
      <v-card
        height="5.5rem"
        width="100%"
      >
        <v-list-item
          three-line
          class="px-2"
        >
          <v-list-item-content class="py-0 d-inline-block">
            <v-list-item-title class="d-flex mb-0">
              <span class="font-weight-medium body-2">
                {{ getTicketById(ticketId).title }}
              </span>
              <span class="font-weight-thin ml-auto body-2">
                #{{ getTicketById(ticketId).issueNumber }}
              </span>
            </v-list-item-title>
            <v-list-item-subtitle class="pa-0">
              <span class="font-weight-light caption">
                {{ getTicketById(ticketId).desc }}
              </span>
            </v-list-item-subtitle>
            <div class="card-bottom">
              <v-chip
                small
                color="dark-grey"
                text-color="white"
              >
                <v-avatar left>
                  <v-icon>mdi-progress-clock</v-icon>
                </v-avatar>
                {{ getTicketById(ticketId).hourEstimate }}hr
              </v-chip>
              <v-avatar
                size="24"
                class="ml-2"
              >
                <img
                  src="@/assets/avatar/scientist.svg"
                  alt="John"
                >
              </v-avatar>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-list-item>
    <USSwitchDialog
      v-if="showDialog"
      @confirm="confirmStorySwitch"
    />
  </draggable>
</template>

<script>

import { mapGetters, mapActions, mapState } from 'vuex';
import draggable from 'vuedraggable';
import Vue from 'vue';
import gqlQueries from '../../graphql/gql-queries';
import USSwitchDialog from './Columns/Dialog.vue';

export default {
  name: 'DraggableTickList',
  components: {
    draggable,
    USSwitchDialog,
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
      'uSChangeDialog',
    ]),
    showDialog() {
      return this.uSChangeDialog.showDialog;
    },
    removedFrom() {
      return this.uSChangeDialog.removedFrom;
    },
    addedTo() {
      return this.uSChangeDialog.addedTo;
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
      'showDialogUSSwitcher',
    ]),
    onRemove() {
      // mutate store
      this.uSCDRemovedFrom(this.listProperties);

      // this.setRemovedFrom(this.listProperties);
    },
    onAdd() {
      // mutate store
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
            break;
        }
      }
    },
    // eslint-disable-next-line no-unused-vars
    switchUserStoryDialog(evt) {
      const tickId = evt.item.id;
      this.uSCDTicketId(tickId);
      this.uSCDEvt(evt);
      this.showDialogUSSwitcher();
    },
    confirmStorySwitch(args) {
      const { ticketId } = this.uSChangeDialog;
      const { evt } = this.uSChangeDialog;

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
        this.switchBack(evt.from, evt.oldDraggableIndex, evt.to, evt.newDraggableIndex);
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
        this.switchBack(evt.from, evt.oldDraggableIndex, evt.to, evt.newDraggableIndex);
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
        this.switchBack(evt.from, evt.oldDraggableIndex, evt.to, evt.newDraggableIndex);
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
        this.switchBack(evt.from, evt.oldDraggableIndex, evt.to, evt.newDraggableIndex);
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
    },
    updateStore() {
      this.fetchSprints();
      this.fetchBackLogData();
    },
  },
};
</script>

<style scoped>
  .card-bottom {
    position:absolute;
    bottom:1px;
    right:1px;
  }
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
