<template>
  <v-carousel
    v-model="carouselModelLocal"
    class="px-2"
    hide-delimiters
    height="100%"
  >
    <v-carousel-item
      v-for="(sprint) in getSprints(proId)"
      :key="sprint.id"
      :name="sprint.sprintNo"
    >
      <div
        class="overline"
      >
        Sprint {{ sprint.sprintNo }}
      </div>
      <draggable
        tag="div"
        v-bind="dragOptions"
        class="v-list v-list--dense"
        style="background: #17429b66; width: 100%; height: 100%; overflow-y: auto"
        @end="tickMoved"
        @add="uSCDAddedTo(listProperties(sprint.id, sprint.sprintNo))"
        @remove="uSCDRemovedFrom(listProperties(sprint.id, sprint.sprintNo))"
      >
        <ticket-card-slim
          v-for="id in tickIdsPerSprint(sprint.id)"
          :key="id"
          :tick-id="id"
        />
      </draggable>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import draggable from 'vuedraggable';
import ticketCardSlim from '@/components/Ticket/card/ticketCardSlim.vue';

export default {
  name: 'SPColumnMiddle',
  components: {
    ticketCardSlim,
    draggable,
  },
  props: {
    userStoryId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    carouselModelLocal: 0,
  }),
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'ticketList',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
    noUs() {
      return this.userStoryId === 'noUs';
    },
    proId() {
      return this.$route.query.proId;
    },
    ...mapState({
      carModP: (state) => state.carouselModelParent,
    }),
    carouselModel: {
      // getter
      get() {
        return this.carModP;
      },
      // setter
      set(newValue) {
        this.setCarouselModel(newValue);
      },
    },
    ...mapGetters({
      tickIds: 'getTickIdsPerSprintUS',
      tickIdsNoUs: 'getTickIdsPerSprintNoUS',
      getSprints: 'getProjectSprints',
    }),
  },
  methods: {
    ...mapActions([
      'setCarouselModel',
      'uSCDRemovedFrom',
      'uSCDAddedTo',
      'uSCDEvt',
      'uSCDTicketId',
    ]),
    tickIdsPerSprint(sprintID) {
      if (this.noUs) {
        return this.tickIdsNoUs(sprintID, this.proId);
      }
      return this.tickIds(sprintID, this.userStoryId, this.proId);
    },
    listProperties(id, sprintNo) {
      return {
        userStoryId: this.userStoryId,
        columnType: 'sprint',
        sprintId: id,
        disabled: false,
        sprintNo,
      };
    },
    tickMoved(evt) {
      this.uSCDTicketId(evt.item.id);
      this.uSCDEvt(evt);
      this.$emit('ticketMove');
    },
  },
};
</script>

<style scoped>

</style>
