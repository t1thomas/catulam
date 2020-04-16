<template>
  <v-carousel
    v-model="carouselModel"
    class="px-2"
    hide-delimiters
    height="100%"
  >
    <v-carousel-item
      v-for="(sprint) in sprintList"
      :key="sprint.id"
      :name="sprint.sprintNo"
    >
      <span>Sprint {{ sprint.sprintNo }}</span>
      <draggable-tick-list
        :ticket-ids="ticsPerSprint(sprint.id, userStoryId)"
        :list-properties="tickListConfig(sprint.id)"
      />
    </v-carousel-item>
  </v-carousel>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import DraggableTickList from '../DraggableTickList.vue';


export default {
  name: 'SPColumnMiddle',
  components: {
    // eslint-disable-next-line vue/no-unused-components
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
      return {
        userStoryId: this.userStoryId, columnType: 'sprint', sprintId: id, disabled: false,
      };
    },
  },
};
</script>

<style scoped>

</style>
