<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <q-bar
        dark
        class="bg-red text-white"
      >
        <div class="text-h6">
          Confirm Change
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
      <q-card-section>
        <div class="text-subtitle2">
          Move
          ticket
          <span
            class="text-subtitle3"
            :style="{background: 'grey'}"
          > {{ ticketTitle }}</span>
          To
        </div>
        <div class="text-subtitle3">
          UserStory
        </div>
        <div class="text-subtitle4">
          <span :style="{background: 'grey'}">{{ uSText }}</span>
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
              :display-value="model ? model.label:null"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    No Sprint Defined
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
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


export default {
  name: 'UserStorySwitchDialog',
  props: {
    ticketTitle: {
      type: String,
      required: true,
    },
    uSText: {
      type: String,
      required: true,
    },
    sprintList: {
      type: Array,
      required: true,
      default: undefined,
    },
    sprintId: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      model: this.startingValue(),
    };
  },
  computed: {
    options() {
      if (this.sprintList === undefined) {
        return null;
      }
      const sprints = [{ id: '0', label: 'Add to Todo (no sprint)' }];
      return sprints.concat(this.sprintList);
    },

  },
  methods: {
    startingValue() {
      if (this.sprintList === undefined) {
        return null;
      }
      if (this.sprintId === undefined) {
        return { id: '0', label: 'Add to Todo (no sprint)' };
      }
      return this.sprintList.find(sprint => sprint.id === this.sprintId);
    },

    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialog.show();
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide(int) {
      this.$refs.dialog.hide(int);
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide');
    },
    onOKClick() {
      if (this.sprintList === undefined) {
          // no sprints
      }
      if (this.sprintId === undefined && this.model.id === '0') {
        // Sprint hasn't been chanegd
      }
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok', { action: 'okay' });
      // or with payload: this.$emit('ok', { ... })
      // then hiding dialog
      this.hide();
    },
    print() {
      console.log(this.model);
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
