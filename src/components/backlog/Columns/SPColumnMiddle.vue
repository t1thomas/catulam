<template>
  <q-carousel
    v-model="carouselModel"
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
      v-for="(sprint) in sprintList"
      :key="sprint.id"
      :name="sprint.sprintNo"
      class="column no-wrap"
    >
      <span>Sprint {{ sprint.sprintNo }}</span>
      <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
        <draggable-tick-list :tickets="ticsPerSprint(sprint.id, tickets)" />
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
import { mapState } from 'vuex';
import DraggableTickList from '../../DraggableTickList.vue';


export default {
  name: 'SPColumnMiddle',
  components: {
    DraggableTickList,
  },
  props: {
    tickets: {
      type: Array,
      required: true,
    },
    carouselModelParent: {
      type: Number,
      required: true,
    },
  },
  computed: {
    // mix this into the outer object with the object spread operator
    ...mapState({
      sprintList: 'sprintList',
    }),

    carouselModel: {
      // getter
      get() {
        return this.carouselModelParent;
      },
      // setter
      set(newValue) {
        this.$emit('update-model', newValue);
      },
    },
  },
  methods: {
    ticsPerSprint(sprintId, tickets) {
      return tickets
        .filter(tick => tick.sprint.id === sprintId);
    },
  },
};
</script>

<style scoped>

</style>
