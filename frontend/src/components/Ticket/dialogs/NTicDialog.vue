<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Create New Ticket</span>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="ticForm"
            v-model="valid"
            :lazy-validation="false"
          >
            <v-overlay
              absolute
              :value="saving"
            >
              <v-progress-circular
                :size="150"
                color="primary"
                indeterminate
              />
            </v-overlay>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="title"
                  filled
                  label="Ticket Title*"
                  :rules="[titleMessage]"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="desc"
                  no-resize
                  filled
                  outlined
                  label="Description"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="hours"
                  filled
                  type="Number"
                  label="Estimated hours"
                  suffix="hrs"
                  outlined
                  :rules="[validHours]"
                  :value="hours"
                  required
                />
              </v-col>
            </v-row>
          </v-form>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary darken-1"
            text
            @click="onCancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="onCreate"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'NTicDialog',
  data: () => ({
    desc: '',
    title: '',
    saving: false,
    hours: 0,
    valid: true,
  }),
  computed: {
    proId() {
      return this.$route.query.proId;
    },
    ...mapState({
      showDialog: (state) => state.nTicketDialog.show,
    }),
  },
  methods: {
    ...mapActions([
      'nTicDialogShow',
      'snackBarOn',
    ]),
    titleMessage(val) {
      if (!val > 0) {
        return 'Field is Required';
      }
      return true;
    },
    validHours() {
      const pattern = /^[0-9]\d*$/;
      if (!pattern.test(this.hours)) {
        return 'Enter valid Number';
      }
      return true;
    },
    onCancel() {
      this.nTicDialogShow({ show: false });
    },
    async onCreate() {
      if (this.$refs.ticForm.validate()) {
        this.setSaving();
        const payload = {
          hourEstimate: Number(this.hours),
          title: this.title,
          desc: this.desc,
          project: { id: this.proId },
        };
        await this.$store.dispatch('createTicket', payload)
          .then(() => {
            this.setSaving();
            this.onCancel();
          })
          .catch(() => {
            this.setSaving();
            this.onCancel();
          });
      }
    },
    setSaving() {
      this.saving = !this.saving;
    },
  },
};
</script>

<style scoped>

</style>
