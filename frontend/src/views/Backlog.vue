<template>
  <v-container
    fluid
    class="fill-height"
  >
    <row-container v-if="loaded" />
    <uStory-det-drawer />
    <del-u-s-dialog />
    <s-planner-dialog />
    <n-u-story-dialog />
    <n-tic-dialog />
    <u-a-dialog />
    <u-s-dialog />
    <edit-member-dialog />
  </v-container>
</template>

<script>
import editMemberDialog from '@/components/backlog/dialogs/EditMembers/editMemberDialog.vue';
import SPlannerDialog from '@/components/pm/SprintPlan/planner dialog/SPlannerDialog.vue';
import NUStoryDialog from '@/components/UserStory/dialogs/NUStoryDialog.vue';
import NTicDialog from '@/components/Ticket/dialogs/NTicDialog.vue';
import USDialog from '@/components/backlog/dialogs/USDialog.vue';
import UADialog from '@/components/backlog/dialogs/UADialog.vue';
import DelUSDialog from '../components/backlog/dialogs/DelUSDialog.vue';
import DetDrawerUStory from '../components/backlog/UStoryDrawer/DetDrawerUStory.vue';
import RowContainer from '../components/backlog/RowContainer.vue';

export default {
  name: 'Backlog',
  components: {
    RowContainer,
    'uStory-det-drawer': DetDrawerUStory,
    DelUSDialog,
    editMemberDialog,
    SPlannerDialog,
    NUStoryDialog,
    NTicDialog,
    USDialog,
    UADialog,
  },
  data: () => ({
    loaded: false,
  }),
  computed: {
    proId() {
      return this.$route.query.proId;
    },
  },
  watch: {
    async proId() {
      this.loaded = false;
      await this.loadData();
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      await this.$store.dispatch('fetchBackLogData', this.proId)
        .then(() => {
          this.loaded = true;
        });
    },
  },
};
</script>

<style scoped>

</style>
