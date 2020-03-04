<template>
  <q-page>
    <div class="q-px-sm q-py-md q-gutter-sm">
      <div
        v-for="(story) in userStories"
        :key="story.id"
        class="row col-auto thendi"
      >
        <div class="col-4">
          <start-column :user-story="story" />
        </div>
        <div class="col-5">
          <sprints-column :attached-tics="story.attachedTics"/>
        </div>
        <div class="col-3">
          <end-column :attached-tics="story.attachedTics" />
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
// import { PortalTarget } from 'portal-vue';
import USColumnStart from '../components/backlog/Columns/USColumnStart.vue';
import USColumnEnd from '../components/backlog/Columns/USColumnEnd.vue';
import SPColumnMiddle from '../components/backlog/Columns/SPColumnMiddle.vue';

export default {
  name: 'Backlog',
  components: {
    'sprints-column': SPColumnMiddle,
    // PortalTarget,
    'start-column': USColumnStart,
    'end-column': USColumnEnd,
  },
  data() {
    return {
      showBranchSelector: false,
      userStories: [{
        id: 'q3ofgqehg9h',
        storyText: 'As a driver, I want to block badly behaved passengers so they are never shown me again.',
        subTasks: true,
        attachedTics: ['5e4d982360b4segsergaf3', '5e4d992f4w3tg3werg2988d'],
      }, {
        id: 'ergsegw45q34',
        storyText: 'As a passenger, I want to link the credit card to my profile so that I can pay for a ride faster, easier and without cash.',
        subTasks: true,
        attachedTics: [],
      }, {
        id: 'r34qr34twq3t',
        storyText: 'As a driver, I want to add photos of my car in my profile so that I can attract more users.',
        subTasks: true,
        attachedTics: ['5e4d993w35gwergsdfg988e'],
      },
      {
        id: '34twertw35yw54yg',
        storyText: 'As a passenger, I want several available drivers to be displayed so that I can choose the most suitable option for me.',
        subTasks: true,
        attachedTics: [],
      }],
    };
  },
  methods: {
    toggleBranchSelector(id) {
      this.$refs.brnSlct.toggleShow(id);
    },
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
