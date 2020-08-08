<template>
  <v-container
    fluid
    class="fill-height"
  >
    <row-container />
    <uStory-det-drawer />
    <del-u-s-dialog />
    <s-planner-dialog />
    <n-u-story-dialog />
    <n-tic-dialog />
    <u-s-dialog />
    <edit-member-dialog />
  </v-container>
</template>

<script>
import editMemberDialog from '@/components/backlog/dialogs/EditMembers/editMemberDialog.vue';
import SPlannerDialog from '@/components/pm/SprintPlan/planner dialog/SPlannerDialog.vue';
import NUStoryDialog from '@/components/UserStory/dialogs/NUStoryDialog.vue';
import NTicDialog from '@/components/Ticket/dialogs/NTicDialog.vue';
import USDialog from '@/components/backlog/dialogs/USSwitchDialog.vue';
import DelUSDialog from '../components/UserStory/dialogs/DelUSDialog.vue';
import DetDrawerUStory from '../components/UserStory/drawer component/DetDrawerUStory.vue';
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
  },
  computed: {
    proId() {
      return this.$route.query.proId;
    },
  },
};
</script>

<style scoped>

</style>
