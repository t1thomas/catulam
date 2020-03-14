<template>
  <q-page>
    <div
      v-if="loaded"
      class="q-px-sm q-py-md q-gutter-sm"
    />
    <UserStoryRows
      v-for="(story) in backLogData"
      :key="story.id"
      :story="story"
    />
    <q-btn
      label="Thendi"
      color="primary"
      @click="handle"
    />
  </q-page>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import UserStoryRows from '../components/backlog/UserStoryRows.vue';

export default {
  name: 'Backlog',
  components: {
    UserStoryRows,
  },
  data() {
    return {
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
    // await this.fetchUserStories();
    await this.fetchTickets();
    await this.fetchSprints();
    await this.fetchBackLogData();
    this.loaded = true;
  },
  methods: {
    ...mapActions([
      'fetchUserStories',
      'fetchTickets',
      'fetchSprints',
      'fetchBackLogData',
    ]),
    handle() {
      this.fetchSprints();
      this.fetchBackLogData();
    },
    // toggleBranchSelector(id) {
    //   this.$refs.brnSlct.toggleShow(id);
    // },

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
