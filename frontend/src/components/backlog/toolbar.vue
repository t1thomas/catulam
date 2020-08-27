<template>
  <v-toolbar
    dense
    fixed
    class="d-inline"
    extension-height="0"
    style="z-index: 1"
  >
    <v-toolbar-title>{{ currPro.title }} ({{ currPro.label }})</v-toolbar-title>
    <template
      v-slot:extension
    >
      <v-spacer />
      <div class="d-inline-flex">
        <v-speed-dial
          v-model="addBtn"
          direction="left"
          transition="slide-x-reverse-transition"
          class="mr-2"
        >
          <template v-slot:activator>
            <v-btn
              v-model="addBtn"
              small
              color="primary darken-2"
              dark
              fab
            >
              <v-icon v-if="addBtn">
                mdi-close
              </v-icon>
              <v-icon v-else>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                dark
                x-small
                color="#1f4423"
                v-on="on"
                @click="nTicDialogShow({ show: true })"
              >
                <v-icon>mdi-ticket-confirmation</v-icon>
              </v-btn>
            </template>
            <span class="caption">New Ticket</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                dark
                x-small
                color="#17429b66"
                v-on="on"
                @click="nUStoryDialogShow({ show: true })"
              >
                <v-icon>mdi-book-open-variant</v-icon>
              </v-btn>
            </template>
            <span class="caption">New Story</span>
          </v-tooltip>
        </v-speed-dial>
      </div>
    </template>
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'ToolbarVue',
  data: () => ({
    addBtn: false,
  }),
  computed: {
    ...mapGetters([
      'getProject',
    ]),
    proId() {
      return this.$route.query.proId;
    },
    currPro() {
      return this.getProject(this.proId);
    },
    ...mapState({
      currUser: (state) => state.currentUser,
    }),
    isPm() {
      return this.currUser.role === 'pm';
    },
  },
  methods: {
    ...mapActions([
      'nTicDialogShow',
      'nUStoryDialogShow',
    ]),
  },
};
</script>

<style scoped>

</style>
