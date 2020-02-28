<template>
  <q-page>
    <sprint-column />
    <!--    <div class="crt-btn-container">-->
    <!--      <q-btn-->
    <!--        class="crt-btn"-->
    <!--        color="primary"-->
    <!--        icon="add"-->
    <!--        rounded-->
    <!--        label="Create Issue"-->
    <!--      />-->
    <!--    </div>-->
    <div class="bklg-list">
      <BackLogList
        ref="bkList"
        @toggleBranchSelector="toggleBranchSelector"
      />
    </div>
    <BranchSelector
      ref="brnSlct"
      @updateTickets="$refs.bkList.fetchIssues()"
    />
  </q-page>
</template>
<script>
import BackLogList from '../components/BackLogList.vue';
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
  .bklg-list {
    display: flex;
    position: absolute;
    top: 23%;
    left: 8%;
    width: 84vw;
    justify-content: center;
  }
</style>
