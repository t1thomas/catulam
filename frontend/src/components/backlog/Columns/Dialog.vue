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
            @click="showDialogUSSwitcher"
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

export default {
  name: 'Dialog',
  data() {
    return {
      selectedSprint: null,
    };
  },
  computed: {
    ...mapState([
      'uSChangeDialog',
    ]),
    showDialog() {
      return this.uSChangeDialog.showDialog;
    },
    ticket() {
      return this.getTicketById(this.uSChangeDialog.ticketId);
    },
    uSToText() {
      return this.getUserStoryText(this.uSChangeDialog.addedTo.userStoryId);
    },
    startingOption() {
      // pre-set the value of the v-select to sprint selected by user
      if (this.uSChangeDialog.addedTo.sprintId === undefined) {
        return this.options[0].value;
      }
      const startSprint = this.getSprintValues
        .find((sprint) => sprint.id === this.uSChangeDialog.addedTo.sprintId);
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
      'showDialogUSSwitcher', // opens/closes dialog
    ]),
    print() {
      console.log(this.getSprintValues);
      console.log(this.selectedSprint);
      console.log(this.selectedOption);
    },
    onConfirm() {
      switch (true) {
        case this.uSChangeDialog.removedFrom.sprintId === undefined
        && this.selectedOption.value === 0:
          console.log('no sprints, ticket moved to Todo in new userStory');
          this.$emit('confirm', { action: 1 });
          break;
        case this.uSChangeDialog.removedFrom.sprintId === undefined
        && this.selectedOption.value !== 0:
          console.log('undefined sprint to changed sprints, ticket with no sprint moved to a sprint in new userStory');
          this.$emit('confirm', { action: 2, sprintId: this.selectedOption.id });
          break;
        case this.uSChangeDialog.removedFrom.sprintId !== undefined
        && this.selectedOption.value === 0:
          console.log('defined sprint to no sprints, ticket with sprint moved to Todo in new userStory (removed sprint)');
          this.$emit('confirm', { action: 3 });
          break;
        case this.uSChangeDialog.removedFrom.sprintId !== this.selectedOption.id:
          console.log('sprint to changed sprints');
          this.$emit('confirm', { action: 4, sprintId: this.selectedOption.id });
          break;
        default:
          console.log('no changed sprints');
          this.$emit('confirm', 5);
          break;
      }
      this.showDialogUSSwitcher();
    },
  },
};
</script>

<style scoped>

</style>
