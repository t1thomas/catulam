<template>
  <div>
    <div
      ref="storyRow"
      class="row col-auto "
    >
      <q-card
        v-if="small"
        class="overlay"
        :style="{ 'z-index': 10,
                  top: style().top,
                  height: style().height,
                  width: style().width,
                  position: 'fixed'
        }"
      >
        <q-card-section class="overlay-content">
          <span> Drag ticket to user story </span>
          <div class="rect" />
        </q-card-section>
      </q-card>
      <div class="col-4">
        <start-column :story="story" />
      </div>
      <div class="col-5">
        <sprints-column
          :user-story-id="story.id"
        />
      </div>
      <div class="col-3">
        <done-column
          :tickets="completedTicks(story.tickets)"
          :user-story-id="story.id"
        />
      </div>
      <div class="col-2">
        <q-btn
          label="Overlay"
          color="primary"
          @click="handleClick"
        />
      </div>
    </div>
  </div>
</template>
<script>
import USColumnStart from './Columns/USColumnStart.vue';
import USColumnEnd from './Columns/USColumnEnd.vue';
import SPColumnMiddle from './Columns/SPColumnMiddle.vue';

export default {
  name: 'UserStoryRows',
  components: {
    'sprints-column': SPColumnMiddle,
    'start-column': USColumnStart,
    'done-column': USColumnEnd,
  },
  props: {
    story: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      small: false,
    };
  },
  computed: {

  },
  methods: {
    sprintTicks(tickets) {
      return tickets
        .filter(tick => tick.done === false
          && tick.sprint != null);
    },
    completedTicks(tickets) {
      return tickets
        .filter(tick => tick.done === true);
    },
    handleClick() {
      this.small = true;
      const rect = this.$refs.storyRow.getBoundingClientRect();
      console.log(rect);
    },
    style() {
      const rect = this.$refs.storyRow.getBoundingClientRect();
      return {
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      };
    },
  },
};
</script>

<style scoped>

  .overlay {
    background: rgba(61, 61, 61, 0.33);
    place-content: center;
    display: flex;
  }
  .overlay-content {
    color: #ffffff;
    place-self: center;
    height: 40%;
  }
  .rect{
    height: 43%;
    margin: 4% auto auto;
    width: 42%;
    border-style: dashed;
  }
</style>
