<template>
  <q-page>
    <div class="row">
      <div
        class="col-9"
        style="background: #c784e3"
      >
        <BackLogList
          ref="bkList"
          @toggleBranchSelector="toggleBranchSelector"
        />
      </div>
      <div class="col-3">
        <sprint-column class="sprint-col" />
      </div>
    </div>
    <BranchSelector
      ref="brnSlct"
      @updateTickets="$refs.bkList.fetchIssues()"
    />
  </q-page>
</template>
<script>
import BackLogList from '../components/backlog/BackLogList.vue';
import BranchSelector from '../components/GitHubLinkStepper.vue';
import SprintListColumn from '../components/backlog/SprintListColumn.vue';

export default {
  name: 'Backlog',
  components: {
    BackLogList,
    BranchSelector,
    'sprint-column': SprintListColumn,
  },
  data() {
    return {
      showBranchSelector: false,
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
  .sprint-col{
   height: 93vh;
  }
    .crt-btn-container {
    display: flex;
    align-items: center;
    position: absolute;
    left: 8%;
    top: 13%;
    width: 84vw;
    background: darkgray;
    height: 56px; /* needs to be responsive */
    border-radius: 25px;
  }
  .crt-btn {
    left: 3%;
  }
  /*.bklg-list {*/
  /*  display: flex;*/
  /*  position: absolute;*/
  /*  top: 23%;*/
  /*  left: 8%;*/
  /*  width: 84vw;*/
  /*  justify-content: center;*/
  /*}*/
</style>
