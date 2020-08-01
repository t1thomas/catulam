<template>
  <v-sheet class="fill-height">
    <draggable
      tag="div"
      v-bind="dragOptions"
      class="v-list v-list--dense fill-height"
      :style="{background: listProperties.background}"
      style="width: 100%; overflow-y: auto"
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
        @dblclick="detDrawShow({ show: true, ticketId: ticketId })"
      >
        <ticket-card
          :tick-id="ticketId"
        />
      </v-list-item>
    </draggable>
  </v-sheet>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import draggable from 'vuedraggable';
import ticketCard from '../Ticket/card/ticketCard.vue';
import gqlQueries from '../../graphql/gql-queries';

export default {
  name: 'DraggableTickList',
  components: {
    draggable,
    ticketCard,
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
      addedTo: (state) => state.sBoardTicMove.addedTo,
      removedFrom: (state) => state.sBoardTicMove.removedFrom,
      ticketId: (state) => state.sBoardTicMove.ticketId,
      evt: (state) => state.sBoardTicMove.evt,
    }),
    proId() {
      return this.$route.query.proId;
    },
  },
  methods: {
    ...mapActions([
      'sBoardEvt',
      'sBoardTicketId',
      'sBoardRemovedFrom',
      'sBoardAddedTo',
      'detDrawShow',
      'snackBarOn',
      'sBoardClear',
    ]),
    onRemove() {
      // mutate store
      this.sBoardRemovedFrom(this.listProperties);
    },
    onAdd() {
      // mutate store
      this.sBoardAddedTo(this.listProperties);
    },
    ended(evt) {
      this.sBoardEvt(evt);
      this.sBoardTicketId(evt.item.id);
      this.ticketMoveResolve();
    },
    async ticketMoveResolve() {
      switch (true) {
        case this.addedTo.columnType === 'to-do':
          await this.moveToToDo();
          break;
        case this.addedTo.columnType === 'doing':
          await this.moveToDoing();
          break;
        default:
          await this.moveToDone();
          break;
      }
      this.sBoardClear();
    },
    async moveToToDo() {
      await this.$apollo.mutate({
        mutation: gqlQueries.sBoardTicMove.MOVE_TO_TODO,
        fetchPolicy: 'no-cache',
        variables: {
          project: { id: this.proId },
          ticket: { id: this.ticketId },
          from: this.removedFrom.columnType,
        },
      }).then((response) => {
        const { TicToToDo } = response.data;
        if (TicToToDo === null) {
          throw new Error('Unable to Complete Operation');
        } else {
          // show success notification of Ticket creation
          this.snackBarOn({
            message: `Moved Ticket ${TicToToDo.title} #${TicToToDo.issueNumber} to TO-DO Successfully`,
            type: 'success',
          });
        }
      }).catch((error) => {
        this.snackBarOn({
          message: error,
          type: 'error',
        });
        this.switchBack();
      });
    },
    async moveToDoing() {
      await this.$apollo.mutate({
        mutation: gqlQueries.sBoardTicMove.MOVE_TO_DOING,
        fetchPolicy: 'no-cache',
        variables: {
          project: { id: this.proId },
          ticket: { id: this.ticketId },
          from: this.removedFrom.columnType,
        },
      }).then((response) => {
        const { TicToDoing } = response.data;
        if (TicToDoing === null) {
          throw new Error('Unable to Complete Operation');
        } else {
          // show success notification of Ticket creation
          this.snackBarOn({
            message: `Moved Ticket ${TicToDoing.title} #${TicToDoing.issueNumber} to DOING Successfully`,
            type: 'success',
          });
        }
      }).catch((error) => {
        this.snackBarOn({
          message: error,
          type: 'error',
        });
        this.switchBack();
      });
    },
    async moveToDone() {
      await this.$apollo.mutate({
        mutation: gqlQueries.sBoardTicMove.MOVE_TO_DONE,
        fetchPolicy: 'no-cache',
        variables: {
          project: { id: this.proId },
          ticket: { id: this.ticketId },
        },
      }).then((response) => {
        const { TicToDone } = response.data;
        if (TicToDone === null) {
          throw new Error('Unable to Complete Operation');
        } else {
          // show success notification of Ticket creation
          this.snackBarOn({
            message: `Moved Ticket ${TicToDone.title} #${TicToDone.issueNumber} to DONE Successfully`,
            type: 'success',
          });
        }
      }).catch((error) => {
        this.snackBarOn({
          message: error,
          type: 'error',
        });
        this.switchBack();
      });
    },

    switchBack() {
      const { evt } = this;
      // remove ticket from new list and put back in old list
      evt.from.insertBefore(evt.to.childNodes[evt.newDraggableIndex],
        evt.from.childNodes[evt.oldDraggableIndex]);
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
