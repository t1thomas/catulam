<template>
  <q-carousel
    v-model="carouselModel"
    transition-prev="slide-right"
    transition-next="slide-left"
    animated
    control-color="primary"
    arrows
    :keep-alive="false"
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
      <div
        class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
      >
        <draggable-tick-list
          :tickets="ticsPerSprint(sprint.id, userStoryId)"
          :list-properties="tickListConfig(sprint.id)"
        />
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import DraggableTickList from '../../DraggableTickList.vue';


export default {
  name: 'SPColumnMiddle',
  components: {
    DraggableTickList,
  },
  props: {
    userStoryId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      sprintList: 'sprintList',
      carModP: 'carouselModelParent',
    }),
    ...mapGetters({
      ticsPerSprint: 'getTicsPerSprint',
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
  },
  methods: {
    ...mapActions([
      'setCarouselModel',
    ]),
    tickListConfig(id) {
      return { userStoryId: this.userStoryId, columnType: 'sprint', sprintId: id };
    },
    // ticsPerSprint(tickets) {
    //   return tickets
    //     .filter(tick => tick.userStory.id === this.userStoryId);
    // },
  },
};
</script>

<style scoped>

</style>
