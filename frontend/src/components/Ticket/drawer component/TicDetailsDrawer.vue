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
      <v-overlay
        absolute
        :value="overlay"
        opacity="0.78"
      >
        <del-tic-dialog @closeDialog="overlay = false" />
      </v-overlay>
      <topSection />
      <v-divider />
      <details-section />
      <v-divider />
      <desc-section />
      <delete-section @delDialog="overlay = true" />
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
import topSection from '../Page Components/topSection.vue';
import detailsSection from '../Page Components/detailsSection.vue';
import descSection from '../Page Components/descSection.vue';
import deleteSection from '../Page Components/deleteSection.vue';
import DelTicDialog from '../dialogs/DelTicDialog.vue';

export default {
  name: 'DetailsDrawer',
  components: {
    topSection,
    detailsSection,
    descSection,
    deleteSection,
    DelTicDialog,
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
        this.$store.commit('set_DrawerShow', { show: val });
        if (val === false) {
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

</style>
