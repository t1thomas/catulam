<template>
  <v-content>
    <UADialog
      v-if="showUADialog"
    />
    <USDialog
      v-if="showUSDialog"
    />
    <UserStoryRows v-if="loaded" />
  </v-content>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import UserStoryRows from '../components/backlog/UserStoryRows.vue';
import UADialog from '../components/backlog/Columns/UADialog.vue';
import USDialog from '../components/backlog/Columns/USDialog.vue';

export default {
  name: 'Backlog',
  components: {
    UserStoryRows,
    UADialog,
    USDialog,
  },
  data: () => ({
    loaded: false,
  }),
  computed: {
    ...mapState({
      showUADialog: (state) => state.changeDialog.showUADialog,
      showUSDialog: (state) => state.changeDialog.showUSDialog,
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
