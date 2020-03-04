<template>
  <q-carousel
    v-model="slide"
    transition-prev="slide-right"
    transition-next="slide-left"
    swipeable
    animated
    control-color="primary"
    arrows
    style="height: 100%;"
    class="bg-grey-1 shadow-2 rounded-borders"
  >
    <q-carousel-slide
      v-for="(sprint, index) in sprintList"
      :key="index"
      :name="index"
      class="column no-wrap"
    >
      <span>{{ index + 1 }}</span>
      <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
        <draggable
          tag="div"
          v-bind="dragOptions"
          class="rounded-borders q-list q-list--bordered"
          style="background: cadetblue; height: 100%;"
        >
          <QItemticketCard
            v-for="ticketID in ticIdsPerSprint(index, attachedTics)"
            :key="ticketID"
            :ticket-id="ticketID"
          />
        </draggable>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
import draggable from 'vuedraggable';

import { mapGetters, mapState } from 'vuex';
import backlogTicketQcard from '../../QItemTicketQcard.vue';

export default {
  name: 'SPColumnMiddle',
  components: {
    draggable,
    QItemticketCard: backlogTicketQcard,
  },
  props: {
    attachedTics: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      slide: 0,
    };
  },
  computed: {
    // mix this into the outer object with the object spread operator
    ...mapState({
      noOfSprints: state => state.sprintList.length,
      sprintList: 'sprintList',
    }),
    ...mapGetters({
      ticIdsPerSprint: 'getUSTicIdsPerSprint',
    }),
    dragOptions() {
      return {
        animation: 0,
        group: 'ticket',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
  },
};
</script>

<style scoped>

</style>
