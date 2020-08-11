<template>
  <v-list-item-content>
    <v-card color="#585858">
      <v-card-title
        style="background: #2d2d2d"
        class="py-1"
      >
        <span> Sprint {{ sprint.sprintNo }} </span>
        <v-spacer />
        <v-menu
          ref="menu1"
          v-model="dateMenu"
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
                pill
              >
                <v-avatar
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
                pill
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
          <date-pick
            v-if="dateMenu"
            :sprint="sprint"
            :date-range="sprintStartEnd"
            @closeMenu="dateMenu = false"
            @saveDates="updateDates"
          />
        </v-menu>
      </v-card-title>
      <v-card-text style="z-index: 0">
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
import { mapActions, mapGetters, mapState } from 'vuex';
import ticketCardSlim from '@/components/Ticket/card/ticketCardSlim.vue';
import DatePick from '@/components/SprintPlan/DatePick.vue';
import gqlQueries from '@/graphql/gql-queries';

export default {
  name: 'SprintItem',
  components: {
    ticketCardSlim,
    draggable,
    DatePick,
  },
  props: {
    sprint: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    saving: false,
    dateMenu: false,
  }),
  computed: {
    ...mapState({
      showMenu: (state) => state.dateMenu,
    }),
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
    setSaving() {
      this.saving = !this.saving;
    },
    async updateDates(val) {
      this.setSaving();
      // format dates
      const start = moment(val.start).format('YYYY-MM-DD');
      const end = moment(val.end).format('YYYY-MM-DD');
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
        this.$store.dispatch('snackBarOn', {
          message: `Unable to update Sprint date: ${error}`,
          type: 'error',
        });
      });
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
