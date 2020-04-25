<template>
  <v-content>
    <UADialog
      v-if="showUADialog"
    />
    <USDialog
      v-if="showUSDialog"
    />
    <DetailsDrawer v-if="showDrawer"/>
    <UserStoryRows v-if="loaded" />
    <NTicDialog v-if="showNTicDialog" />
  </v-content>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import UserStoryRows from '../components/backlog/UserStoryRows.vue';
import UADialog from '../components/backlog/Columns/UADialog.vue';
import USDialog from '../components/backlog/Columns/USDialog.vue';
import DetailsDrawer from '../components/backlog/DetailsDrawer.vue';
import NTicDialog from '../components/backlog/NTicDialog.vue';

export default {
  name: 'Backlog',
  components: {
    UserStoryRows,
    UADialog,
    USDialog,
    // eslint-disable-next-line vue/no-unused-components
    DetailsDrawer,
    NTicDialog,
  },
  data: () => ({
    loaded: false,
  }),
  computed: {
    ...mapState({
      showUADialog: (state) => state.changeDialog.showUADialog,
      showUSDialog: (state) => state.changeDialog.showUSDialog,
      showNTicDialog: (state) => state.nTicketDialog.show,
      showDrawer: (state) => state.detailsDrawer.show,
    }),
    proId() {
      return this.$route.query.proId;
    },
  },
  async mounted() {
    await this.fetchBackLogData(this.proId);
    await this.fetchCurrProElements(this.proId);
    this.loaded = true;
  },
  methods: {
    ...mapActions([
      'fetchBackLogData',
      'fetchCurrProElements',
    ]),
  },
};
</script>

<style scoped>

</style>
