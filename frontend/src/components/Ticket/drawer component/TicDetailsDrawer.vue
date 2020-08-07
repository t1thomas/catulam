<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    right
    style="width: fit-content;"
  >
    <div
      v-if="tickId !== null"
      class="grid-container"
    >
      <topSection />
      <details-parent />
      <desc-section />
      <updates-parent />
    </div>
    <v-overlay
      absolute
      :value="overlay"
      opacity="0.78"
    >
      <del-tic-dialog @closeOverlay="overlay = false" />
    </v-overlay>
    <template v-slot:append>
      <delete-section @delDialog="overlay = true" />
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import topSection from './Sections/topSection.vue';
import detailsParent from './Sections/detailsSection/detailsParent.vue';
import descSection from './Sections/descSection.vue';
import deleteSection from './Sections/deleteSection.vue';
import DelTicDialog from '../dialogs/DelTicDialog.vue';
import updatesParent from './Sections/Comments&CommitsSection/updatesParent.vue';

export default {
  name: 'DetailsDrawer',
  components: {
    topSection,
    detailsParent,
    descSection,
    deleteSection,
    DelTicDialog,
    updatesParent,
  },
  data: () => ({
    overlay: false,
  }),
  computed: {
    ...mapState({
      show: (state) => state.detailsDrawer.show,
      tickId: (state) => state.detailsDrawer.ticketId,
    }),
    drawer: {
      get() {
        return this.show;
      },
      set(val) {
        if (val === false) {
          this.$store.dispatch('detDrawShow', { show: val });
          this.overlay = false;
          this.$store.dispatch('showAddCommitOverLay', false);
        }
      },
    },
  },
};
</script>

<style scoped>
.grid-container {
  height: inherit;
  width: 37vw;
  display: grid;
  overflow: hidden;
  grid-template-rows: auto;
}
</style>
