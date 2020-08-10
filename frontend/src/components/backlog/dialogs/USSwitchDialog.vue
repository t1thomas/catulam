<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title v-if="showDialog">
          <span class="headline">Move Ticket:
            <span
              style="background: grey;font-style: italic"
            > #{{ ticket.issueNumber }} {{ ticket.title }}</span>
          </span>
        </v-card-title>
        <v-card-text v-if="showDialog">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-alert type="error">
                  {{ alertText.pre }}:<br>
                  <span :style="{background: 'grey'}">{{ alertText.highlight }}</span>
                </v-alert>
              </v-col>
              <v-col
                cols="12"
              >
                <v-select
                  v-model="selectedSprint"
                  :items="options"
                  label="Select Sprint"
                  filled
                  required
                  return-object
                  item-text="text"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary darken-1"
            text
            @click="onCancel"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary darken-1"
            text
            @click="onConfirm"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'Dialog',
  data() {
    return {
      selectedSprint: null,
    };
  },
  computed: {
    proId() {
      return this.$route.query.proId;
    },
    ...mapState({
      ticketId: (state) => state.backlogTicMove.ticketId,
      evt: (state) => state.backlogTicMove.evt,
      addedTo: (state) => state.backlogTicMove.addedTo,
      removedFrom: (state) => state.backlogTicMove.removedFrom,
      showDialog: (state) => state.showUSDialog,
    }),
    alertText() {
      if (this.addedTo.userStoryId === 'noUs') {
        return { pre: 'Moving ticket to:', highlight: 'Unassigned Ticket List' };
      }
      return { pre: 'Moving Ticket to User Story:', highlight: this.uSToText };
    },
    ticket() {
      return this.getTicketById(this.ticketId);
    },
    uSToText() {
      return this.getUserStoryText(this.addedTo.userStoryId);
    },
    ...mapGetters([
      'getUserStoryText',
      'getTicketById',
      'getSprintValues',
    ]),
    options() {
      return this.getSprintValues;
    },
  },
  watch: {
    showDialog() {
      if (this.showDialog) {
        if (this.addedTo.columnType === 'sprint') {
          const index = this.options.findIndex((sprint) => sprint.id === this.addedTo.sprintId);
          this.selectedSprint = this.options[index];
        } else {
          // eslint-disable-next-line prefer-destructuring
          this.selectedSprint = this.options[0];
        }
      }
    },
  },
  methods: {
    ...mapActions([
      'snackBarOn',
    ]),
    async onConfirm() {
      const payload = {};
      payload.project = { id: this.proId };
      payload.tick = { id: this.ticketId };
      switch (true) {
        case this.removedFrom.userStoryId === 'noUs' && this.addedTo.userStoryId !== 'noUs':
          payload.uStoryAdd = { id: this.addedTo.userStoryId };
          break;
        case this.removedFrom.userStoryId !== 'noUs' && this.addedTo.userStoryId === 'noUs':
          payload.uStoryRemove = { id: this.removedFrom.userStoryId };
          break;
        case this.removedFrom.userStoryId !== 'noUs' && this.addedTo.userStoryId !== 'noUs':
          payload.uStoryRemove = { id: this.removedFrom.userStoryId };
          payload.uStoryAdd = { id: this.addedTo.userStoryId };
          break;
        default:
          break;
      }
      Object.assign(payload, this.resolveSprintAddRemove());
      await this.$store.dispatch('TicketSwitch', payload);
    },
    resolveSprintAddRemove() {
      const payload = {};
      switch (true) {
        case this.removedFrom.sprintId === undefined && this.selectedSprint.id !== 'noId': {
          payload.sprintAdd = { id: this.selectedSprint.id };
          break;
        }
        case this.removedFrom.sprintId !== undefined && this.selectedSprint.id === 'noId': {
          payload.sprintRemove = { id: this.removedFrom.sprintId };
          break;
        }
        case this.removedFrom.sprintId !== undefined
        && this.selectedSprint.id !== this.removedFrom.sprintId: {
          payload.sprintRemove = { id: this.removedFrom.sprintId };
          payload.sprintAdd = { id: this.selectedSprint.id };
          break;
        }
        default:
          break;
      }
      return payload;
    },
    onCancel() {
      this.switchBack();
      this.$store.dispatch('uSDialogShow', false);
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

</style>
