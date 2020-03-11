<template>
  <q-page>
    <div
      v-if="loaded"
      class="q-px-sm q-py-md q-gutter-sm"
    >
      <div
        v-for="(story) in backLogData"
        :key="story.id"
        class="row col-auto "
      >
        <div class="col-4">
          <start-column :story="story" />
        </div>
        <div class="col-5">
          <sprints-column
            :carousel-model-parent="carouselModelParent"
            :tickets="sprintTicks(story.tickets)"
            :user-story-id="story.id"
            @update-model="updateModel"
          />
        </div>
        <div class="col-3">
          <done-column
            :tickets="completedTicks(story.tickets)"
            :user-story-id="story.id"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import USColumnStart from '../components/backlog/Columns/USColumnStart.vue';
import USColumnEnd from '../components/backlog/Columns/USColumnEnd.vue';
import SPColumnMiddle from '../components/backlog/Columns/SPColumnMiddle.vue';

export default {
  name: 'Backlog',
  components: {
    'sprints-column': SPColumnMiddle,
    'start-column': USColumnStart,
    'done-column': USColumnEnd,
  },
  data() {
    return {
      carouselModelParent: 1,
      showBranchSelector: false,
      loaded: false,
    };
  },
  computed: {
    ...mapState([
      'userStories',
      'backLogData',
    ]),
  },
  async mounted() {
    await this.fetchUserStories();
    await this.fetchTickets();
    await this.fetchSprints();
    await this.fetchBackLogData();
    this.loaded = true;
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
    ...mapActions([
      'fetchUserStories',
      'fetchTickets',
      'fetchSprints',
      'fetchBackLogData',
    ]),
    // toggleBranchSelector(id) {
    //   this.$refs.brnSlct.toggleShow(id);
    // },
    updateModel(newValue) {
      this.carouselModelParent = newValue;
    },

    // sprintCheck(tickId) {
    //   let tickInSprint = false;
    //   this.$store.state.sprintList.forEach((sprint) => {
    //     if (sprint.ticketIds.includes(tickId)) {
    //       tickInSprint = true;
    //     }
    //   });
    //   return tickInSprint;
    // },
  },
};
</script>

<style scoped>
  /*.sprint-col{*/
  /* height: 93vh;*/
  /*}*/
  /*  .crt-btn-container {*/
  /*  display: flex;*/
  /*  align-items: center;*/
  /*  position: absolute;*/
  /*  left: 8%;*/
  /*  top: 13%;*/
  /*  width: 84vw;*/
  /*  background: darkgray;*/
  /*  height: 56px; !* needs to be responsive *!*/
  /*  border-radius: 25px;*/
  /*}*/
  /*.crt-btn {*/
  /*  left: 3%;*/
  /*}*/
  /*.bklg-list {*/
  /*  display: flex;*/
  /*  position: absolute;*/
  /*  top: 23%;*/
  /*  left: 8%;*/
  /*  width: 84vw;*/
  /*  justify-content: center;*/
  /*}*/
</style>
