<template>
  <q-dialog
    v-if="showDialog"
    ref="dialog"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <q-bar
        dark
        class="bg-red text-white"
      >
        <div class="text-h6">
          Switch User Story
        </div>
        <q-space />
        <q-btn
          v-close-popup
          dense
          flat
          icon="close"
        >
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section
        v-if="loading"
      >
        <q-spinner
          color="primary"
          size="3em"
        />
      </q-card-section>
      <q-card-section
        v-else
      >
        <div class="text-subtitle2">
          Move
          ticket
          <span
            class="text-subtitle3"
            :style="{background: 'grey'}"
          > {{ ticket.title }} #{{ ticket.issueNumber }}</span>
          To
        </div>
        <div class="text-subtitle3">
          UserStory
        </div>
        <div class="text-subtitle4">
          <span :style="{background: 'grey'}">{{ uSToText }}</span>
        </div>
        <div
          class="q-pa-md"
          style="max-width: 300px"
        >
          <div class="q-gutter-md">
            <div class="text-subtitle3">
              Sprint
            </div>
            <q-select
              v-model="model"
              filled
              :options="options"
              label="Select Sprint"
              :display-value="model ? model.label : null"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="card-actions">
        <q-btn
          color="primary"
          label="Cancel"
          @click="onCancelClick"
        />
        <q-btn
          color="primary"
          label="Print"
          @click="print"
        />
        <q-btn
          color="primary"
          label="Confirm"
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'UserStorySwitchDialog',
  props: {
    ticketId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      model: null,
      loading: false,
      optionUnchanged: true,
    };
  },
  computed: {
    ...mapState([
      'removedFrom',
      'addedTo',
      'showDialog',
    ]),
    ticket() {
      return this.getTicketById(this.ticketId);
    },
    uSToText() {
      return this.getUserStoryText(this.addedTo.userStoryId);
    },
    startingOption() {
      if (this.addedTo.sprintId === undefined) {
        return this.options[0];
      }
      return this.getSprintValues.find((sprint) => sprint.id === this.addedTo.sprintId);
    },
    ...mapGetters([
      'getUserStoryText',
      'getTicketById',
      'getSprintValues',
    ]),
    options() {
      const sprints = [{ id: '0', label: 'Add to Todo (no sprint)' }];
      return sprints.concat(this.getSprintValues);
    },

  },
  mounted() {
    this.model = this.startingOption;
  },
  methods: {

    print() {
      console.log(this.model);
    },
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialog.show();
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide');
    },
    onOKClick() {
      switch (true) {
        case this.removedFrom.sprintId === undefined && this.model.id === '0':
          console.log('no sprints, ticket moved to Todo in new userStory');
          this.$emit('ok', { action: 1 });
          break;
        case this.removedFrom.sprintId === undefined && this.model.id !== '0':
          console.log('undefined sprint to changed sprints, ticket with no sprint moved to a sprint in new userStory');
          this.$emit('ok', { action: 2, sprintId: this.model.id });
          break;
        case this.removedFrom.sprintId !== undefined && this.model.id === '0':
          console.log('defined sprint to no sprints, ticket with sprint moved to Todo in new userStory (removed sprint)');
          this.$emit('ok', { action: 3 });
          break;
        case this.removedFrom.sprintId !== this.model.id:
          console.log('sprint to changed sprints');
          this.$emit('ok', { action: 4, sprintId: this.model.id });
          break;
        default:
          console.log('no changed sprints');
          this.$emit('ok', 5);
          break;
      }
      // this.removedFrom.sprintId === this.model.id


      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      // or with payload: this.$emit('ok', { ... })
      // then hiding dialog
      this.hide();
    },
    onCancelClick() {
      // we just need to hide dialog
      this.hide();
    },
  },
};
</script>

<style scoped>
.card-actions{
place-content: space-between;
}
</style>
