<template>
  <v-row
    v-model="showDialog"
    justify="center"
  >
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Move Ticket:
            <span
              :style="{background: 'grey'}"
            > {{ ticket.title }} #{{ ticket.issueNumber }}</span>
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-if="toUS">
              <v-col cols="12">
                <v-alert type="error">
                  Moving Ticket to:<br>
                  <span :style="{background: 'grey'}">Unassigned Tickets</span>
                </v-alert>
              </v-col>
              <v-col
                cols="12"
              />
            </v-row>
            <v-row v-else>
              <v-col cols="12">
                <v-alert type="error">
                  Moving Ticket to User Story:<br>
                  <span :style="{background: 'grey'}">{{ uSToText }}</span>
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
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="onCancel"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="print"
          >
            Print
          </v-btn>
          <v-btn
            color="blue darken-1"
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
import Vue from 'vue';
import gqlQueries from '../../../graphql/gql-queries';

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
      evt: (state) => state.changeDialog.evt,
      addedTo: (state) => state.changeDialog.addedTo,
      removedFrom: (state) => state.changeDialog.removedFrom,
      ticketId: (state) => state.changeDialog.ticketId,
      showDialog: (state) => state.changeDialog.showUADialog,
    }),
    ticket() {
      return this.getTicketById(this.ticketId);
    },
    uSToText() {
      return this.getUserStoryText(this.addedTo.userStoryId);
    },
    toUS() {
      // ticket that wants to be moved into Unassigned tickets
      return this.addedTo.columnType === 'Unassigned';
    },
    startingOption() {
      // pre-set the value of the v-select to sprint selected by user
      if (this.addedTo.sprintId === undefined) {
        return this.options[0].value;
      }
      const startSprint = this.getSprintValues
        .find((sprint) => sprint.id === this.addedTo.sprintId);
      return startSprint.value;
    },
    ...mapGetters([
      'getUserStoryText',
      'getTicketById',
      'getSprintValues',
    ]),
    options() {
      return this.getSprintValues;
    },
    selectedOption() {
      return this.getSprintValues
        .find((sprint) => sprint.value === this.selectedSprint);
    },
  },
  mounted() {
    this.selectedSprint = this.startingOption;
  },
  methods: {
    ...mapActions([
      'UADialogSwitcher', // opens/closes dialog
      'fetchBackLogData',
    ]),
    print() {
      console.log(this.getSprintValues);
      console.log(this.selectedSprint);
      console.log(this.selectedOption);
    },
    onConfirm() {
      switch (true) {
        case this.removedFrom.columnType === 'Unassigned'
        && this.selectedOption.value === 0:
          console.log('no sprints, ticket moved to Todo in new userStory');
          this.addNewUS(); // TESTED
          break;
        case this.removedFrom.columnType === 'Unassigned'
        && this.selectedOption.value !== 0:
          console.log('undefined sprint to changed sprints, ticket with no sprint moved to a sprint in new userStory');
          this.addNewUSNewSp(this.selectedOption.id); // TESTED
          break;
        case this.removedFrom.columnType === 'start':
          console.log('from todo of an user story to Unassigned tick list (removes userstory)');
          this.remUS();
          break;
        default:
          console.log('from sprint of user story to Unassigned tick list (removes userstory and sprint)');
          this.remUSRemSP(); // TESTED
          break;
      }
      this.UADialogSwitcher();
    },
    onCancel() {
      this.switchBack();
      this.UADialogSwitcher();
    },
    async remUSRemSP() {
      console.log('remUSRemSP');
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUnassigned.REMOVE_USERSTORY_REMOVE_SPRINT,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: { id: this.ticketId },
          uStoryRemove: { id: this.removedFrom.userStoryId },
          sprintRemove: { id: this.removedFrom.sprintId },
        },
      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
        this.switchBack();
      });
    },
    async remUS() {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUnassigned.REMOVE_USERSTORY,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: { id: this.ticketId },
          uStoryRemove: { id: this.removedFrom.userStoryId },
        },
      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
        this.switchBack();
      });
    },
    async addNewUSNewSp(sprintAddId) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUnassigned.ADD_NEW_USERSTORY_ADD_NEW_SPRINT,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: { id: this.ticketId },
          uStoryAdd: { id: this.addedTo.userStoryId },
          sprintAdd: { id: sprintAddId },
        },
      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
        this.switchBack();
      });
    },
    async addNewUS() {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUnassigned.ADD_NEW_USERSTORY,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: { id: this.ticketId },
          uStoryAdd: { id: this.addedTo.userStoryId },
        },
      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
        this.switchBack();
      });
    },
    switchBack() {
      const { evt } = this;
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

</style>
