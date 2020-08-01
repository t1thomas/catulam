<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    right
    style="width: fit-content;"
  >
    <div
      v-if="dataLoaded"
      class="grid-container pa-2"
    >
      <topSection />
      <details-section />
      <desc-section />
      <updates-section />
      <delete-section @delDialog="overlay = true" />
    </div>
    <v-overlay
      absolute
      :value="overlay"
      opacity="0.78"
    >
      <del-tic-dialog @closeDialog="overlay = false" />
    </v-overlay>

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
import topSection from './Sections/topSection.vue';
import detailsSection from './Sections/detailsSection.vue';
import descSection from './Sections/descSection.vue';
import deleteSection from './Sections/deleteSection.vue';
import DelTicDialog from '../dialogs/DelTicDialog.vue';
import updatesSection from './Sections/cmnts&cmits/updatesSection.vue';

export default {
  name: 'DetailsDrawer',
  components: {
    topSection,
    detailsSection,
    descSection,
    deleteSection,
    DelTicDialog,
    updatesSection,
  },
  data: () => ({
    overlay: false,
  }),
  computed: {
    dataLoaded() {
      return this.ticket !== null;
    },
    ...mapState({
      show: (state) => state.detailsDrawer.show,
      ticketId: (state) => state.detailsDrawer.ticketId,
      ticket: (state) => state.currentTicket,
    }),
    drawer: {
      get() {
        return this.show;
      },
      set(val) {
        if (val === false) {
          this.$store.commit('set_DrawerShow', { show: val });
          this.overlay = false;
        }
      },
    },
  },
  watch: {
    async show(val) {
      // if val === true i.e if drawer is showing
      if (val) {
        await this.fetchCurrTicket(this.ticketId);
      }
    },
  },
  methods: {
    ...mapActions([
      'detDrawShow',
      'fetchCurrTicket',
    ]),
  },
};
</script>

<style scoped>
.grid-container {
  height: 100%;
  display: grid;
  overflow: hidden;
  grid-template-rows: auto 1fr auto 2fr auto;
}
</style>
