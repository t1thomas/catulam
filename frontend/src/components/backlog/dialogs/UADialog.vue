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
                <v-alert
                  v-if="toUa"
                  type="error"
                >
                  Moving Ticket to Unassigned tickets:
                </v-alert>
                <v-alert
                  v-else
                  type="error"
                >
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
    toUa() {
      // ticket that wants to be moved into Unassigned tickets to a sprint
      return this.addedTo.userStoryId === null;
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
      'snackBarOn',
    ]),
    async onConfirm() {
      switch (true) {
        case this.removedFrom.userStoryId === null && this.removedFrom.columnType === 'start':
          await this.removedFromUaStart();
          break;
        case this.removedFrom.userStoryId === null && this.removedFrom.columnType === 'sprint':
          await this.removedFromUaSprint();
          break;
        case this.removedFrom.userStoryId !== null && this.removedFrom.columnType === 'start':
          await this.removeFromUsStart();
          break;
        case this.removedFrom.userStoryId !== null && this.removedFrom.columnType === 'sprint':
          await this.removeFromUsSprint();
          break;
        default:
          break;
      }
      this.UADialogSwitcher();
    },
    onCancel() {
      this.switchBack();
      this.UADialogSwitcher();
    },
    async removedFromUaStart() {
      if (this.addedTo.userStoryId === null) {
        await this.startSwitch();
      } else if (this.selectedOption.value === 0) {
        await this.dataMutation({
          project: { id: this.proId },
          tick: { id: this.ticketId },
          uStoryAdd: { id: this.addedTo.userStoryId },
        });
      } else {
        await this.dataMutation({
          project: { id: this.proId },
          tick: { id: this.ticketId },
          uStoryAdd: { id: this.addedTo.userStoryId },
          sprintAdd: { id: this.selectedOption.id },
        });
      }
    },
    async removedFromUaSprint() {
      if (this.addedTo.userStoryId === null) {
        await this.sprintSwitch();
      } else {
        switch (true) {
          case this.selectedOption.value === 0:
            // moves to us start
            await this.dataMutation({
              project: { id: this.proId },
              tick: { id: this.ticketId },
              uStoryAdd: { id: this.addedTo.userStoryId },
              sprintRemove: { id: this.removedFrom.sprintId },
            });
            break;
          case this.removedFrom.sprintId !== this.selectedOption.id:
            /* 'from ua sprint to us changed sprint'
          (adds userStory, removes old sprint,  adds new sprint) */
            await this.dataMutation({
              project: { id: this.proId },
              tick: { id: this.ticketId },
              uStoryAdd: { id: this.addedTo.userStoryId },
              sprintRemove: { id: this.removedFrom.sprintId },
              sprintAdd: { id: this.selectedOption.id },
            });
            break;
          default:
            // 'no sprints, ticket moved to To-do in new userStory')
            await this.dataMutation({
              project: { id: this.proId },
              tick: { id: this.ticketId },
              uStoryAdd: { id: this.addedTo.userStoryId },
            });
            break;
        }
      }
    },
    async sprintSwitch() {
      switch (true) {
        case this.selectedOption.value === 0:
          await this.$apollo.mutate({
            mutation: gqlQueries.SwitchStartSprint.TIC_REMOVE_SPRINT,
            fetchPolicy: 'no-cache',
            variables: {
              project: { id: this.proId },
              ticket: { id: this.ticketId },
              sprintRemove: { id: this.removedFrom.sprintId },
            },
          })
            .then((response) => {
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
              this.switchBack();
            });
          break;
        case this.removedFrom.sprintId !== this.selectedOption.id:
          await this.$apollo.mutate({
            mutation: gqlQueries.SwitchStartSprint.TIC_CHANGE_SPRINT,
            fetchPolicy: 'no-cache',
            variables: {
              project: { id: this.proId },
              ticket: { id: this.ticketId },
              sprintRemove: { id: this.removedFrom.sprintId },
              sprintAdd: { id: this.selectedOption.id },
            },
          }).then((response) => {
            const { SwitchSprint } = response.data;
            if (SwitchSprint === null) {
              throw new Error('Unable to Update Ticket');
            } else {
              // show success notification of Ticket creation
              this.snackBarOn({
                message: `Switched Ticket ${SwitchSprint.title} #${SwitchSprint.issueNumber} to Sprint ${SwitchSprint.sprint.sprintNo} Successfully`,
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
          break;
        default:
          this.switchBack();
          break;
      }
    },
    async startSwitch() {
      if (this.selectedOption.value === 0) {
        this.switchBack();
      } else {
        await this.$apollo.mutate({
          mutation: gqlQueries.SwitchStartSprint.TIC_ADD_SPRINT,
          variables: {
            project: { id: this.proId },
            ticket: { id: this.ticketId },
            sprintAdd: { id: this.addedTo.sprintId },
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
          this.switchBack();
        });
      }
    },
    async removeFromUsStart() {
      // case this.removedFrom.userStoryId !== null && this.removedFrom.columnType === 'start':
      if (this.selectedOption.value === 0) {
        await this.dataMutation({
          project: { id: this.proId },
          tick: { id: this.ticketId },
          uStoryRemove: { id: this.removedFrom.userStoryId },
        });
      } else {
        await this.dataMutation({
          project: { id: this.proId },
          tick: { id: this.ticketId },
          uStoryRemove: { id: this.removedFrom.userStoryId },
          sprintAdd: { id: this.selectedOption.id },
        });
      }
    },
    async removeFromUsSprint() {
      // case this.removedFrom.userStoryId !== null && this.removedFrom.columnType === 'sprint':
      switch (true) {
        case this.selectedOption.value === 0:
          await this.dataMutation({
            project: { id: this.proId },
            tick: { id: this.ticketId },
            uStoryRemove: { id: this.removedFrom.userStoryId },
            sprintRemove: { id: this.removedFrom.sprintId },
          });
          break;
        case this.removedFrom.sprintId === this.selectedOption.id:
          await this.dataMutation({
            project: { id: this.proId },
            tick: { id: this.ticketId },
            uStoryRemove: { id: this.removedFrom.userStoryId },
          });
          break;
        default:
          await this.dataMutation({
            project: { id: this.proId },
            tick: { id: this.ticketId },
            uStoryRemove: { id: this.removedFrom.userStoryId },
            sprintRemove: { id: this.removedFrom.sprintId },
            sprintAdd: { id: this.selectedOption.id },
          });
          break;
      }
    },
    async dataMutation(payload) {
      await this.$apollo.mutate({
        mutation: gqlQueries.SwitchUnassigned.UNASSIGNED_TICK_SWITCH,
        fetchPolicy: 'no-cache',
        variables: payload,
      })
        .catch((error) => {
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
    updateStore() {
      this.fetchBackLogData(this.proId);
    },
  },
};
</script>

<style scoped>

</style>
