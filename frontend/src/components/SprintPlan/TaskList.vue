<template>
  <v-card
    style="height: 100%"
    color="#585858"
  >
    <v-toolbar flat>
      <v-toolbar-title class="body-1">
        Backlog Tickets - not assigned to sprint
      </v-toolbar-title>
    </v-toolbar>
    <draggable
      tag="div"
      v-bind="dragOptions"
      class="v-list v-list--dense"
      style="width: 100%; min-height: 89vh; max-height: 89vh;
       overflow-y: auto; overflow-x: hidden;"
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
  </v-card>
</template>

<script>
import draggable from 'vuedraggable';
import { mapActions, mapGetters } from 'vuex';
import ticketCardSlim from '@/components/Ticket/card/ticketCardSlim.vue';

export default {
  name: 'TaskList',
  components: {
    ticketCardSlim,
    draggable,
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
        sprintId: 'noSprint',
      };
    },
    ...mapGetters([
      'getProjectTicketsNoSp',
    ]),
    proId() {
      return this.$route.query.proId;
    },
    tickets() {
      return this.getProjectTicketsNoSp(this.proId);
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

</style>
