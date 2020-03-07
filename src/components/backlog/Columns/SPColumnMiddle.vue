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
      v-for="(sprint, index) in sprintList"
      :key="index"
      :name="index"
      class="column no-wrap"
    >
      <span>{{ index + 1 }}</span>
      <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
        <draggable-tick-list :ticket-ids="ticIdsPerSprint(index, attachedTics)" />
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import DraggableTickList from '../../DraggableTickList.vue';


export default {
  name: 'SPColumnMiddle',
  components: {
    DraggableTickList,
  },
  props: {
    attachedTics: {
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
      noOfSprints: state => state.sprintList.length,
      sprintList: 'sprintList',
    }),
    ...mapGetters({
      ticIdsPerSprint: 'getUSTicIdsPerSprint',
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
};
</script>

<style scoped>

</style>
