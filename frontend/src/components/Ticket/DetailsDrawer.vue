<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    right
    style="width: fit-content"
  >
    <v-container
      v-if="dataLoaded"
    >
      <topSection />
      <v-divider />
      <details-section />
      <v-divider />
      <desc-section />
    </v-container>


    <v-progress-circular
      v-if="!dataLoaded"
      style="display: contents"
      :size="50"
      color="primary"
      indeterminate
    />
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import topSection from './topSection.vue';
import detailsSection from './detailsSection.vue';
import descSection from './descSection.vue';

export default {
  name: 'DetailsDrawer',
  components: {
    topSection,
    detailsSection,
    descSection,
  },
  computed: {
    proId() {
      return this.$route.query.proId;
    },
    dataLoaded() {
      return this.ticket !== null && this.project !== null;
    },
    ...mapState({
      show: (state) => state.detailsDrawer.show,
      ticketId: (state) => state.detailsDrawer.ticketId,
      ticket: (state) => state.currentTicket,
      project: (state) => state.currProElements,
    }),
    drawer: {
      get() {
        return this.show;
      },
      set(val) {
        this.$store.commit('set_DrawerShow', { show: val });
      },
    },
  },
  watch: {
    async show(val) {
      if (val) {
        await this.fetchCurrTicket(this.ticketId);
      }
    },
  },
  // async mounted() {
  //   await this.fetchCurrTicket(this.ticketId);
  // },
  methods: {
    ...mapActions([
      'detDrawShow',
      'fetchCurrTicket',
    ]),
  },
};
</script>

<style scoped>

</style>
