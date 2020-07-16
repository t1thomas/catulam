<template>
  <v-row justify="center">
    <v-dialog
      v-model="show"
      max-width="400px"
    >
      <v-card color="#2d2c2c">
        <v-card-title>
          <span class="title">Create New Sprint</span>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="sprintForm"
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
            <v-row no-gutters>
              <v-col cols="12">
                <v-text-field
                  label="Sprint no."
                  :value="`Sprint ${sprintCount + 1}`"
                  outlined
                  filled
                  disabled
                />
              </v-col>
              <v-col cols="12">
                <v-menu
                  ref="menu1"
                  v-model="dateMenu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-x
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="formatDateRange"
                      label="Start ~ End*"
                      hint="YYYY/MM/DD format"
                      persistent-hint
                      :rules="[dateMenuError]"
                      prepend-icon="mdi-calendar-today"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="dateRange"
                    no-title
                    :show-current="false"
                    range
                    scrollable
                    :picker-date="datesMinMax().min"
                    :min="datesMinMax().min"
                    :max="datesMinMax().max"
                  />
                </v-menu>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <small class="ma-2">*indicates required field</small>

          <v-spacer />
          <v-btn
            color="blue darken-1"
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
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';
import gqlQueries from '../../../../graphql/gql-queries';

export default {
  name: 'NSprintDialog',
  data: () => ({
    saving: false,
    dateRange: [],
    valid: true,
    dateMenu1: false,
    dateMenu2: false,
  }),
  computed: {
    proId() {
      return this.$route.query.proId;
    },
    formatDateRange() {
      return this.dateRange.join(' ~ ');
    },
    sprintCount() {
      return this.sprints.length;
    },
    ...mapState({
      showDialog: (state) => state.nSpDialog,
      project: (state) => state.sPlanDialog.project,
      sprints: (state) => state.sPlanDialog.sprints,
    }),
    show: {
      get() {
        return this.showDialog;
      },
      set(val) {
        this.$store.commit('set_nSpDialog', val);
      },
    },

  },
  methods: {
    ...mapActions([
      'snackBarOn',
    ]),
    dateMenuError(val) {
      if (!val > 0) {
        return 'Field is Required';
      }
      return true;
    },
    onCancel() {
      this.$store.commit('set_nSpDialog', false);
    },
    datesMinMax() {
      let min;
      let max;
      // if there are any sprints currently in the project
      if (this.sprintCount > 0) {
        // find the last sprint date
        const start = Vue.$moment(this.sprints[this.sprints.length - 1].endDate).endOf('day');
        start.add(1, 'days');
        min = start.toISOString().substr(0, 10);
        // find project end date
        const end = Vue.$moment(this.project.endDate).endOf('day');
        max = end.toISOString().substr(0, 10);
      } else {
        min = this.project.startDate;
        max = this.project.endDate;
      }
      return { min, max };
    },
    async onCreate() {
      if (this.$refs.sprintForm.validate()) {
        this.setSaving();
        await this.$apollo.mutate({
          mutation: gqlQueries.CREATE_SPRINT,
          fetchPolicy: 'no-cache',
          variables: {
            sprintNo: this.sprintCount + 1,
            active: false,
            startDate: this.dateRange[0],
            endDate: this.dateRange[1],
            project: { id: this.proId },
          },
        }).then((response) => {
          const { CreateSprint } = response.data;
          if (CreateSprint === null) {
            throw new Error('Unable to Create Ticket');
          } else {
            // show success notification of sprint creation
            this.snackBarOn({
              message: `Created Sprint ${CreateSprint.sprintNo} Successfully`,
              type: 'success',
            });
          }
        }).catch((error) => {
          // show Error notification of sprint creation fail
          this.snackBarOn({
            message: error,
            type: 'error',
          });
        });
        this.setSaving();
        this.onCancel();
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
