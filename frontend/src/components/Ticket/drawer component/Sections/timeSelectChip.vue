<template>
  <v-menu
    v-model="selector"
    offset-y
    :close-on-content-click="false"
    transition="scale-transition"
    origin="top left"
  >
    <template v-slot:activator="{ on }">
      <v-chip
        pill
        style="max-width: fit-content"
        v-on="on"
      >
        <v-avatar left>
          <v-progress-circular
            v-if="saving"
            indeterminate
            color="amber"
          />
          <v-icon
            v-else-if="hourEstimateText"
          >
            mdi-progress-clock
          </v-icon>
          <v-icon
            v-else
            dark
          >
            mdi-help-circle
          </v-icon>
        </v-avatar>
        {{ hourEstimateText }}
        <v-icon
          dark
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
          <v-icon color="myBlue">
            mdi-check-circle
          </v-icon>
        </v-btn>
        <v-btn
          icon
          small
          :disabled="valueSame"
          @click="setOriginalHours"
        >
          <v-icon color="myBlue">
            mdi-undo
          </v-icon>
        </v-btn>
      </div>
    </v-container>
  </v-menu>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'TimeSelectChip',
  data: () => ({
    selector: false,
    saving: false,
    hours: 0,
  }),
  computed: {
    ...mapState({
      ticket: 'currentTicket',
    }),
    hourEstimateText() {
      if (this.hourEstimate === null) {
        return 'Set Hour Estimate';
      }
      return `${this.hourEstimate} hr`;
    },
    hourEstimate() {
      return this.ticket.hourEstimate;
    },
    valueSame() {
      return this.hourEstimate === Number(this.hours);
    },
    validInput() {
      const pattern = /^[1-9]\d*$/;
      return pattern.test(this.hours);
    },
  },
  mounted() {
    this.setOriginalHours();
  },
  methods: {
    ...mapActions([
      'snackBarOn',
      'updateTicketHours',
    ]),
    setOriginalHours() {
      this.hours = this.hourEstimate;
    },
    async changeHours() {
      if (this.validInput) {
        this.saving = true;
        const payload = { id: this.ticket.id, hrs: Number(this.hours) };
        await this.updateTicketHours(payload);
        this.selector = false;
        this.saving = false;
      } else {
        const payload = { message: 'Enter valid number greater than 0', type: 'warning' };
        this.snackBarOn(payload);
      }
    },
  },
};
</script>

<style scoped>
  .v-menu__content {
    overflow-y: hidden;
  }
</style>
