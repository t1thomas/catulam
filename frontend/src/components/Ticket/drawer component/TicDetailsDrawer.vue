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
      class="grid-container pa-2"
    >
      <topSection />
      <details-section />
<!--      <desc-section />-->
<!--      <updates-section />-->
<!--      <delete-section @delDialog="overlay = true" />-->
    </div>
<!--    <v-overlay-->
<!--      absolute-->
<!--      :value="overlay"-->
<!--      opacity="0.78"-->
<!--    >-->
<!--      <del-tic-dialog @closeDialog="overlay = false" />-->
<!--    </v-overlay>-->
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import topSection from './Sections/topSection.vue';
import detailsSection from './Sections/detailsSection/detailsSection.vue';
// import descSection from './Sections/descSection.vue';
// import deleteSection from './Sections/deleteSection.vue';
// import DelTicDialog from '../dialogs/DelTicDialog.vue';
// import updatesSection from './Sections/cmnts&cmits/updatesSection.vue';

export default {
  name: 'DetailsDrawer',
  components: {
    topSection,
    detailsSection,
    // descSection,
    // deleteSection,
    // DelTicDialog,
    // updatesSection,
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
        }
      },
    },
  },
};
</script>

<style scoped>
.grid-container {
  height: 100%;
  width: 34vw;
  display: grid;
  overflow: hidden;
  grid-template-rows: auto 1fr auto 2fr auto;
}
</style>
