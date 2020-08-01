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
      <draggable-tick-list
        v-if="!noUs"
        :ticket-ids="tickIds(sprint.id, userStoryId)"
        :list-properties="tickListConfig(sprint.id, sprint.sprintNo)"
      />
      <draggable-tick-list
        v-else
        :ticket-ids="tickIdsNoUs(sprint.id)"
        :list-properties="tickListConfig(sprint.id, sprint.sprintNo)"
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
    DraggableTickList,
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
    ]),
    tickListConfig(id, sprintNo) {
      if (!this.noUs) {
        return {
          userStoryId: this.userStoryId,
          columnType: 'sprint',
          sprintId: id,
          disabled: false,
          sprintNo,
        };
      }
      return {
        userStoryId: null,
        columnType: 'sprint',
        sprintId: id,
        disabled: false,
        sprintNo,
      };
    },
  },
};
</script>

<style scoped>

</style>
