<template>
  <v-list-item>
    <v-list-item-content @click="print">Time Estimate:</v-list-item-content>
    <v-list-item-content class="align-end">
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
                v-else
              >
                mdi-progress-clock
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
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

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
  mounted() {
    this.setOriginalHours();
  },
  methods: {
    ...mapActions([
      'snackBarOn',
      'updateTicketHours',
    ]),
    print() {
      console.log(this.hours);
    },
    setOriginalHours() {
      this.hours = this.ticket.hourEstimate;
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
