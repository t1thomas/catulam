<template>
  <v-list-item-content>
    <v-card color="#585858">
      <v-toolbar flat>
        <v-toolbar-title class="grey--text">
          Sprint {{ sprint.sprintNo }}
        </v-toolbar-title>
        <v-spacer />
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
            </v-card>
          </template>
          <v-date-picker
            v-model="dateRange"
            no-title
            :show-current="false"
            :event-color="date => proStartEnd.indexOf(date) === 1 ? 'red' : 'green'"
            :color="date => dateRange.indexOf(date) === 1 ? 'red' : 'green'"
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
              @click="$refs.menu1.save(date)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-toolbar>
      <v-card-text>
        <draggable
          tag="div"
          v-bind="dragOptions"
          class="v-list v-list--dense"
          style="width: 100%; height: 100%; overflow-y: auto"
          @end="tickMoved"
          @add="spAddedTo(listProperties)"
          @remove="spRemovedFrom(listProperties)"
        >
          <ticket-card-slim
            v-for="tick in tickets"
            :key="tick.id"
            :ticket="tick"
          />
        </draggable>
        <div
          :style="{height: `${itemHeight}px`}"
          class="hrsLeft-box"
        >
          <span> {{ hoursLeft }}hrs left </span>
        </div>
      </v-card-text>
    </v-card>
  </v-list-item-content>
</template>

<script>
import draggable from 'vuedraggable';
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import ticketCardSlim from '@/components/Ticket/card/ticketCardSlim.vue';

export default {
  name: 'SprintItem',
  components: {
    ticketCardSlim,
    draggable,
  },
  props: {
    sprint: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dateRange: [],
    dateMenu1: false,
  }),
  computed: {
    proId() {
      return this.$route.query.proId;
    },
    currPro() {
      return this.getProject(this.proId);
    },
    proStartEnd() {
      return [this.currPro.startDate, this.currPro.endDate];
    },
    sprintStartEnd() {
      return [this.sprint.startDate, this.sprint.endDate];
    },
    dragOptions() {
      return {
        animation: 200,
        group: 'ticketList',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
    dateSame() {
      return JSON.stringify(this.dateRange) === JSON.stringify(this.sprintStartEnd);
    },
    listProperties() {
      return {
        sprintId: this.sprint.id,
      };
    },
    ...mapGetters([
      'getProject',
      'getProjectSprints',
      'getUnDoneTicksBySprint',
      'getDoneTicksBySprint',
      'getAllTicksBySprint',
    ]),

    tickets() {
      return this.getAllTicksBySprint(this.sprint.id);
    },
    tickHours() {
      let hrs = 0;
      this.tickets.forEach((tick) => {
        hrs += tick.hourEstimate;
      });
      return hrs;
    },
    totalHours() {
      const start = moment(this.sprint.startDate);
      const end = moment(this.sprint.endDate);
      const totalDays = end.diff(start, 'days');
      const totalHours = 7.5 * totalDays;
      return Math.round(totalHours * 1e2) / 1e2;
    },
    hoursLeft() {
      return this.totalHours - this.tickHours;
    },
    itemHeight() {
      const base = 25 / 7.5;
      const ttlHeight = base * this.hoursLeft;
      return Math.round(ttlHeight * 1e2) / 1e2;
    },
  },
  mounted() {
    this.setSprintDates();
  },
  methods: {
    ...mapActions([
      'spEvt',
      'spTicketId',
      'spRemovedFrom',
      'spAddedTo',
    ]),
    setSprintDates() {
      this.dateRange = this.sprintStartEnd;
    },
    tickMoved(evt) {
      this.spTicketId(evt.item.id);
      this.spEvt(evt);
    },
  },
};
</script>

<style scoped>
.hrsLeft-box {
  display: flex;
  place-items: center;
  place-content: center;
  border: solid white !important;
}
</style>
