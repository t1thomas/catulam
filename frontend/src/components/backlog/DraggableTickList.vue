<template>
  <v-sheet class="fill-height">
    <draggable
      tag="div"
      v-bind="dragOptions"
      class="v-list v-list--dense"
      style="background: #17429b66; width: 100%; height: 100%; overflow-y: auto"
      @end="ended"
      @add="onAdd"
      @remove="onRemove"
    >
      <v-list-item
        v-for="ticketId in ticketIds"
        :id="ticketId"
        :key="ticketId"
        v-ripple
        class="pa-0 ma-sm-1"
        clickable
      >
        <ticket-card-slim
          :tick-id="ticketId"
        />
      </v-list-item>
    </draggable>
  </v-sheet>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import draggable from 'vuedraggable';
import ticketCardSlim from '../Ticket/card/ticketCardSlim.vue';
import gqlQueries from '../../graphql/gql-queries';

export default {
  name: 'DraggableTickList',
  components: {
    draggable,
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
    dragOptions() {
      return {
        animation: 200,
        group: 'ticketList',
        disabled: this.listProperties.disabled,
        ghostClass: 'ghost',
      };
    },
    ...mapState({
      addedTo: (state) => state.changeDialog.addedTo,
      removedFrom: (state) => state.changeDialog.removedFrom,
    }),
    proId() {
      return this.$route.query.proId;
    },
  },
  methods: {
    ...mapActions([
      'fetchBackLogData',
      'uSCDRemovedFrom',
      'uSCDAddedTo',
      'uSCDTicketId',
      'uSCDEvt',
      'USDialogSwitcher',
      'UADialogSwitcher',
      'detDrawShow',
      'snackBarOn',
    ]),
    onRemove() {
      // mutate store
      this.uSCDRemovedFrom(this.listProperties);
    },
    onAdd() {
      // mutate store
      this.uSCDAddedTo(this.listProperties);
    },
    ended(evt) {
      this.ticketMoveResolve(evt);
    },
    ticketMoveResolve(evt) {
      const ticketId = evt.item.id;
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
              this.startToSprint(ticketId, toData.sprintId, evt);
              break;
            case fromData.columnType === 'sprint' && toData.columnType === 'start':
              this.sprintToStart(ticketId, fromData.sprintId, evt);
              break;
            default:
              break;
          }
        }
      }
    },
    switchUADialog(evt) {
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
    async sprintToStart(ticketId, sprintId, evt) {
      await this.$apollo.mutate({
        mutation: gqlQueries.SwitchStartSprint.TIC_REMOVE_SPRINT,
        fetchPolicy: 'no-cache',
        variables: {
          project: { id: this.proId },
          ticket: { id: ticketId },
          sprintRemove: { id: sprintId },
        },
      }).then((response) => {
        const { SprintToStart } = response.data;
        if (SprintToStart === null) {
          throw new Error('Unable to Update Ticket');
        } else {
          // show success notification of Ticket creation
          this.snackBarOn({
            message: `Removed Ticket ${SprintToStart.title} #${SprintToStart.issueNumber} from sprint Successfully`,
            type: 'success',
          });
        }
      }).catch((error) => {
        this.snackBarOn({
          message: error,
          type: 'error',
        });
        this.switchBack(evt);
      });
    },
    async startToSprint(ticketId, sprintId, evt) {
      await this.$apollo.mutate({
        mutation: gqlQueries.SwitchStartSprint.TIC_ADD_SPRINT,
        variables: {
          project: { id: this.proId },
          ticket: { id: ticketId },
          sprintAdd: { id: sprintId },
        },
      }).then((response) => {
        const { StartToSprint } = response.data;
        if (StartToSprint === null) {
          throw new Error('Unable to Update Ticket');
        } else {
          // show success notification of Ticket creation
          this.snackBarOn({
            message: `Moved Ticket ${StartToSprint.title} #${StartToSprint.issueNumber} to Sprint ${StartToSprint.sprint.sprintNo} Successfully`,
            type: 'success',
          });
        }
      }).catch((error) => {
        this.snackBarOn({
          message: error,
          type: 'error',
        });
        this.switchBack(evt);
      });
    },
    switchBack(evt) {
      // remove ticket from new list and put back in old list
      evt.from.insertBefore(evt.to.childNodes[evt.newDraggableIndex],
        evt.from.childNodes[evt.oldDraggableIndex]);
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
