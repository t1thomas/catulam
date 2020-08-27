<template>
  <v-row justify="center">
    <v-dialog
      v-model="show"
      max-width="400px"
      persistent
    >
      <v-card color="#2d2c2c">
        <v-card-title>
          <span class="title">Create New Sprint</span>
        </v-card-title>
        <v-card-text>
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
              <v-form
                ref="sprintForm"
                v-model="valid"
                :lazy-validation="false"
              >
                <v-menu
                  ref="menu1"
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-x
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="selected"
                      label="Start ~ End*"
                      hint="YYYY/MM/DD format"
                      persistent-hint
                      :rules="[dateMenuError]"
                      prepend-icon="mdi-calendar-today"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <date-pick
                    v-if="dateMenu"
                    :date-range="dateRange"
                    @closeMenu="dateMenu = false"
                    @saveDates="setChosenDates"
                  />
                </v-menu>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <small class="ma-2">*indicates required field</small>

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
import { mapActions, mapGetters, mapState } from 'vuex';
import moment from 'moment';
import DatePick from '@/components/SprintPlan/DatePick.vue';
import gqlQueries from '../../graphql/gql-queries';

export default {
  name: 'NSprintDialog',
  components: {
    DatePick,
  },
  data: () => ({
    saving: false,
    dateRange: null,
    valid: true,
    dateMenu: false,
  }),
  computed: {
    ...mapGetters([
      'getProject',
      'getProjectSprints',
    ]),
    proId() {
      return this.$route.query.proId;
    },
    selected() {
      if (this.dateRange !== null) {
        const date = this.formatDate();
        return `${date.start} ~ ${date.end}`;
      } return null;
    },
    sprintCount() {
      return this.getProjectSprints(this.proId).length;
    },
    ...mapState({
      showDialog: (state) => state.nSpDialog,
    }),
    show: {
      get() {
        return this.showDialog;
      },
      set(val) {
        if (!val) {
          this.onCancel();
        }
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
    formatDate() {
      const start = moment(this.dateRange.start).format('YYYY-MM-DD');
      const end = moment(this.dateRange.end).format('YYYY-MM-DD');
      return { start, end };
    },
    onCancel() {
      this.$store.dispatch('nSprintDialog', false);
      this.$refs.sprintForm.reset();
      this.dateRange = null;
    },
    setChosenDates(val) {
      this.dateRange = val;
    },
    async onCreate() {
      if (this.$refs.sprintForm.validate()) {
        this.setSaving();
        const date = this.formatDate();

        await this.$apollo.mutate({
          mutation: gqlQueries.CREATE_SPRINT,
          fetchPolicy: 'no-cache',
          variables: {
            startDate: date.start,
            endDate: date.end,
            project: { id: this.proId },
          },
        }).then(() => {
          this.setSaving();
          this.onCancel();
        }).catch((error) => {
          this.setSaving();
          this.onCancel();
          // show Error notification of sprint creation fail
          this.snackBarOn({
            message: `Unable to create Sprint: ${error}`,
            type: 'error',
          });
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
