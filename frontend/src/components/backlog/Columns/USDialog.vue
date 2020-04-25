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
            <v-row>
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
      showDialog: (state) => state.changeDialog.showUSDialog,
    }),
    ticket() {
      return this.getTicketById(this.ticketId);
    },
    uSToText() {
      return this.getUserStoryText(this.addedTo.userStoryId);
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
      'USDialogSwitcher', // opens/closes dialog
      'fetchBackLogData',
    ]),
    print() {
      console.log(this.getSprintValues);
      console.log(this.selectedSprint);
      console.log(this.selectedOption);
    },
    onConfirm() {
      switch (true) {
        case this.removedFrom.sprintId === undefined
        && this.selectedOption.value === 0:
          console.log('no sprints, ticket moved to Todo in new userStory');
          this.uStorySwitchOnly();
          break;
        case this.removedFrom.sprintId === undefined
        && this.selectedOption.value !== 0:
          console.log('undefined sprint to changed sprints, ticket with no sprint moved to a sprint in new userStory');
          this.uStorySwitchAddNewSprint(this.selectedOption.id);
          break;
        case this.removedFrom.sprintId !== undefined
        && this.selectedOption.value === 0:
          console.log('defined sprint to no sprints, ticket with sprint moved to Todo in new userStory (removed sprint)');
          this.uStorySwitchRemoveSprint();
          break;
        case this.removedFrom.sprintId !== this.selectedOption.id:
          console.log('sprint to changed sprints');
          this.uStorySwitchChangeSprint(this.selectedOption.id);
          break;
        default:
          console.log('no changed sprints');
          this.uStorySwitchOnly();
          break;
      }
      this.USDialogSwitcher();
    },
    async uStorySwitchOnly() {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUserStory.storySwitch,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: this.ticketId,
          usFrom: this.removedFrom.userStoryId,
          usTo: this.addedTo.userStoryId,
        },
      }).then((response) => {
        console.log(response);
        this.updateStore();
      }).catch((error) => {
        console.error(error);
        this.switchBack();
      });
    },
    async uStorySwitchAddNewSprint(sprintAddId) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUserStory.AddNewSprint,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: { id: this.ticketId },
          sprintAdd: { id: sprintAddId },
          uStoryRemove: { id: this.removedFrom.userStoryId },
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
    async uStorySwitchRemoveSprint() {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUserStory.RemoveSprint,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: { id: this.ticketId },
          sprintRemove: { id: this.removedFrom.sprintId },
          uStoryRemove: { id: this.removedFrom.userStoryId },
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
    // yet to be tested
    async uStorySwitchChangeSprint(sprintAddId) {
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SwitchUserStory.ChangeSprint,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: { id: this.ticketId },
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
        this.switchBack();
      });
    },
    onCancel() {
      this.switchBack();
      this.USDialogSwitcher();
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
