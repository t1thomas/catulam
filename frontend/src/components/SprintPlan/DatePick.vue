<template>
  <v-card>
    <v-card-text>
      <datepicker
        v-model="selectedDates"
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
        @click="$emit('closeMenu')"
      >
        Cancel
      </v-btn>
      <v-spacer />
      <v-btn
        :disabled="dateSame"
        color="primary"
        @click="$emit('saveDates', selectedDates);
                $emit('closeMenu');"
      >
        {{ btnText }}
        <v-icon right>
          mdi-check-circle
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';

export default {
  name: 'DatePick',
  components: {
    datepicker: DatePicker,
  },
  props: {
    sprint: {
      type: Object,
      default: null,
    },
    dateRange: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    saving: false,
    dateMenu1: false,
    selectedDates: null,
    colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
  }),
  computed: {
    btnText() {
      if (this.noSprint) {
        return 'Pick';
      }
      return 'Save';
    },
    noSprint() {
      return this.sprint === null;
    },
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
    attrs() {
      // highlight dates of other sprints
      let colorIndex = 0;
      const sprintId = (this.noSprint ? null : this.sprint.id);
      // highlight dates of other sprints in date picker
      const highlights = this.getProjectSprints(this.proId)
        .reduce((arr, currSp) => {
          if (currSp.id !== sprintId) {
            arr.push({
              highlight: {
                color: this.colors[colorIndex],
                fillMode: 'light',
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
      highlights.push({
        dot: {
          color: 'green',
        },
        popover: {
          label: 'Project Start',
        },
        dates: new Date(this.currPro.startDate),
      });
      highlights.push({
        dot: {
          color: 'red',
        },
        popover: {
          label: 'Project End',
        },
        dates: new Date(this.currPro.endDate),
      });
      return highlights;
    },
    dateSame() {
      return JSON.stringify(this.dateRange) === JSON.stringify(this.selectedDates);
    },
    proId() {
      return this.$route.query.proId;
    },
    currPro() {
      return this.getProject(this.proId);
    },
  },
  mounted() {
    this.setSelectedDates();
  },
  methods: {
    setSelectedDates() {
      this.selectedDates = this.dateRange;
    },
  },
};
</script>

<style scoped>

</style>
