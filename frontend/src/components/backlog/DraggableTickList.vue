<template>
  <v-sheet style="height: 100%">
    <div
      v-if="sprintColumn"
      class="overline"
    >
      Sprint {{ listProperties.sprintNo }}
    </div>
    <draggable
      tag="div"
      v-bind="dragOptions"
      class="v-list v-list--dense"
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
import ticketCardSlim from './ticketCardSlim.vue';

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
    sprintColumn() {
      return this.listProperties.columnType === 'sprint';
    },
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
