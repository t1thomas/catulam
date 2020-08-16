<template>
  <tr>
    <td>Time Estimate:</td>
    <td>
      <v-menu
        v-model="selector"
        offset-y
        :close-on-content-click="false"
        transition="scale-transition"
        origin="top left"
      >
        <template v-slot:activator="{ on }">
          <v-chip
            small
            pill
            v-on="on"
          >
            <v-avatar left>
              <v-progress-circular
                v-if="saving"
                indeterminate
                color="amber"
              />
              <v-icon
                v-else
              >
                mdi-progress-clock
              </v-icon>
            </v-avatar>
            {{ hourEstimateText }}
            <v-icon
              dark
              small
              class="ml-2"
            >
              mdi-pencil-outline
            </v-icon>
          </v-chip>
        </template>
        <v-container
          class="accent pl-1 pr-0 py-0 d-inline-flex"
        >
          <v-text-field
            v-model="hours"
            filled
            type="Number"
            suffix="hrs"
            outlined
            style="width: 125px"
            hide-details
            :value="hours"
          />
          <div style="display: grid">
            <v-btn
              icon
              small
              :disabled="valueSame"
              @click="changeHours"
            >
              <v-icon color="primary">
                mdi-check-circle
              </v-icon>
            </v-btn>
            <v-btn
              icon
              small
              :disabled="valueSame"
              @click="setOriginalHours"
            >
              <v-icon color="primary">
                mdi-undo
              </v-icon>
            </v-btn>
          </div>
        </v-container>
      </v-menu>
    </td>
  </tr>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import gqlQueries from '@/graphql/gql-queries';

export default {
  name: 'TimeEstimate',
  data: () => ({
    selector: false,
    saving: false,
    hours: 0,
  }),
  computed: {
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
    hourEstimateText() {
      return `${this.ticket.hourEstimate} hr`;
    },
    valueSame() {
      return this.ticket.hourEstimate === Number(this.hours);
    },
    validInput() {
      const pattern = /^[1-9]\d*$/;
      return pattern.test(this.hours);
    },
  },
  watch: {
    hourEstimateText() {
      this.hours = this.ticket.hourEstimate;
    },
  },
  mounted() {
    this.setOriginalHours();
  },
  methods: {
    ...mapActions([
      'snackBarOn',
    ]),
    setOriginalHours() {
      this.hours = this.ticket.hourEstimate;
    },
    async changeHours() {
      if (this.validInput) {
        this.setSaving();
        await this.$apollo.mutate({
          mutation: gqlQueries.UPDATE_TICKET_ETIME,
          fetchPolicy: 'no-cache',
          variables: { tick: { id: this.ticket.id }, hrs: Number(this.hours) },
        }).then(() => {
          this.setSaving();
          this.selector = false;
        }).catch((error) => {
          this.setSaving();
          this.selector = false;
          this.$store.dispatch('snackBarOn', {
            message: `Unable to update time estimate: ${error}`,
            type: 'error',
          });
        });
      } else {
        const payload = { message: 'Enter valid number greater than 0', type: 'warning' };
        this.snackBarOn(payload);
      }
    },
    setSaving() {
      this.saving = !this.saving;
    },
  },
};
</script>

<style scoped>
.v-menu__content {
  overflow-y: hidden;
}
</style>
