<template>
  <v-list-item-content>
    <v-card color="#585858">
      <v-toolbar flat>
        <v-toolbar-title class="grey--text">
          Sprint {{ sprint.sprintNo }}
        </v-toolbar-title>
        <v-spacer />
        <date-picker :sprint="sprint"/>
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
import DatePicker from '@/components/SprintPlan/DatePicker.vue';

export default {
  name: 'SprintItem',
  components: {
    ticketCardSlim,
    draggable,
    DatePicker,
  },
  props: {
    sprint: {
      type: Object,
      required: true,
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'ticketList',
        disabled: false,
        ghostClass: 'ghost',
      };
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
  methods: {
    ...mapActions([
      'spEvt',
      'spTicketId',
      'spRemovedFrom',
      'spAddedTo',
    ]),
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
