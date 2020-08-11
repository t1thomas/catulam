<template>
  <v-menu
    ref="menu1"
    v-model="dateMenu1"
    :disabled="saving"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="17.938rem"
    min-width="17.938rem"
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
    <v-card>
      <v-card-text>
        <datepicker
          v-model="dateRange"
          mode="range"
          is-inline
          is-dark
          :attributes="attrs"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="primary"
          @click="dateMenu1 = false"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          :disabled="dateSame"
          color="primary"
          @click="changeDates"
        >
          Save
          <v-icon right>
            mdi-check-circle
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import gqlQueries from '@/graphql/gql-queries';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';

export default {
  name: 'DatePick',
  components: {
    datepicker: DatePicker,
  },
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
    selectedDate: null,
    colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
  }),
  computed: {
    ...mapGetters([
      'getProject',
      'getProjectSprints',
    ]),
    selectDragAttribute() {
      return {
        popover: {
          visibility: 'click',
          isInteractive: false, // Defaults to true when using slot
        },
      };
    },
    sprintStartEnd() {
      const start = new Date(this.sprint.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(this.sprint.endDate);
      end.setHours(0, 0, 0, 0);
      return {
        start,
        end,
      };
    },
    attrs() {
      // highlight dates of other sprints
      let colorIndex = 0;
      return this.getProjectSprints(this.proId)
        .reduce((arr, currSp) => {
          if (currSp.id !== this.sprint.id) {
            arr.push({
              highlight: {
                color: this.colors[colorIndex],
                fillMode: 'none',
              },
              popover: {
                label: `Sprint ${currSp.sprintNo}`,
              },
              dates: {
                start: new Date(currSp.startDate),
                end: new Date(currSp.endDate),
              },
            });
            if (colorIndex === this.colors.length - 1) {
              colorIndex = 0;
            } else {
              colorIndex += 1;
            }
          }
          return arr;
        }, []);
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
    print() {
      console.log(this.dateRange);
    },
    setSprintDates() {
      this.dateRange = this.sprintStartEnd;
    },
    setSaving() {
      this.saving = !this.saving;
    },
    async changeDates() {
      this.setSaving();
      this.dateMenu1 = false;
      // format dates
      const start = moment(this.dateRange.start).format('YYYY-MM-DD');
      const end = moment(this.dateRange.end).format('YYYY-MM-DD');
      await this.$apollo.mutate({
        mutation: gqlQueries.UPDATE_SPRINT,
        fetchPolicy: 'no-cache',
        variables: {
          sprint: { id: this.sprint.id },
          startDate: start,
          endDate: end,
        },
      }).then(() => {
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
