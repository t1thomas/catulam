<template>
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
      <v-card
        raised
        color="#414141"
        v-on="on"
      >
        <v-chip
          class="ma-2"
          color="success"
          outlined
        >
          <v-avatar
            tile
            left
          >
            <span style="font-size: smaller">Start</span>
          </v-avatar>
          {{ sprint.startDate }}
        </v-chip>
        <v-chip
          class="ma-2"
          color="red"
          outlined
        >
          <v-avatar
            tile
            left
          >
            <span style="font-size: smaller">End</span>
          </v-avatar>
          {{ sprint.endDate }}
        </v-chip>
        <v-progress-linear
          :active="saving"
          indeterminate
          bottom
          absolute
          color="amber"
        />
      </v-card>
    </template>
    <v-date-picker
      v-model="dateRange"
      no-title
      :show-current="false"
      :event-color="date => proStartEnd.indexOf(date) === 1 ? 'red' : 'green'"
      :events="proStartEnd"
      range
      scrollable
    >
      <div>
        <v-badge
          color="green"
          dot
          left
          inline
        >
          <span style="font-size: smaller">
            Project Start
          </span>
        </v-badge>
        <v-badge
          color="red"
          dot
          left
          inline
        >
          <span style="font-size: smaller">
            Project End
          </span>
        </v-badge>
      </div>
      <v-spacer />
      <v-btn
        text
        color="primary"
        @click="dateMenu1 = false"
      >
        Cancel
      </v-btn>
      <v-btn
        :disabled="dateSame"
        text
        color="primary"
        @click="changeDates"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import gqlQueries from '@/graphql/gql-queries';

export default {
  name: 'DatePicker',
  props: {
    sprint: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    saving: false,
    dateRange: null,
    dateMenu1: false,
  }),
  computed: {
    ...mapGetters([
      'getProject',
    ]),
    sprintStartEnd() {
      return [this.sprint.startDate, this.sprint.endDate];
    },
    dateSame() {
      return JSON.stringify(this.dateRange) === JSON.stringify(this.sprintStartEnd);
    },
    proId() {
      return this.$route.query.proId;
    },
    currPro() {
      return this.getProject(this.proId);
    },
    proStartEnd() {
      return [this.currPro.startDate, this.currPro.endDate];
    },
  },
  watch: {
    dateMenu1(val) {
      if (val) {
        this.setSprintDates();
      }
    },
  },
  methods: {
    setSprintDates() {
      this.dateRange = this.sprintStartEnd;
    },
    setSaving() {
      this.saving = !this.saving;
    },
    async changeDates() {
      this.setSaving();
      this.dateMenu1 = false;
      // sort the selected date range in ascending order
      const sortedDates = this.dateRange.sort((a, b) => moment(a).diff(moment(b)));
      await this.$apollo.mutate({
        mutation: gqlQueries.UPDATE_SPRINT,
        fetchPolicy: 'no-cache',
        variables: {
          sprint: { id: this.sprint.id },
          startDate: sortedDates[0],
          endDate: sortedDates[1],
        },
      }).then((response) => {
        const { UpdateSprint } = response.data;
        console.log(UpdateSprint);
        this.setSaving();
      }).catch((error) => {
        this.setSaving();
        this.disabled = false;
        this.$store.dispatch('snackBarOn', {
          message: error,
          type: 'error',
        });
      });
    },
  },
};
</script>

<style scoped>

</style>
