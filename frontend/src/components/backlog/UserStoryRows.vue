<template>
  <v-card color="#5c535366">
    <v-card-title
      class="pa-0"
    >
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
          <v-speed-dial
            v-model="addBtn"
            right
            absolute
            direction="left"
            transition="slide-x-reverse-transition"
          >
            <template v-slot:activator>
              <v-btn
                v-model="addBtn"
                small
                color="blue darken-2"
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
                  @click="nTicShow"
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
                >
                  <v-icon>mdi-book-open-variant</v-icon>
                </v-btn>
              </template>
              <span class="caption">New Story</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  fab
                  dark
                  x-small
                  color="#4d371a"
                  v-on="on"
                  @click="sPlanShow"
                >
                  <v-icon>mdi-run-fast</v-icon>
                </v-btn>
              </template>
              <span class="caption">New Sprint</span>
            </v-tooltip>
          </v-speed-dial>
        </template>
      </v-toolbar>
    </v-card-title>

    <v-divider />
    <v-card-text class="pa-2">
      <div
        class="containers overflow-y-auto"
        style="height: 80vh"
      >
        <v-row
          no-gutters
          class="mb-0"
        >
          <v-col
            class="columns"
            cols="5"
          >
            <start-column user-story-id="noUs" />
          </v-col>
          <v-col
            class="columns"

            cols="4"
          >
            <sprints-column user-story-id="noUs" />
          </v-col>
          <v-col
            class="columns"

            cols="3"
          >
            <done-column user-story-id="noUs" />
          </v-col>
        </v-row>
        <v-row
          v-for="story in currPro.userStories"
          :key="story.id"
          class="mb-0"
          no-gutters
        >
          <v-col
            class="columns"
            cols="5"
          >
            <start-column :user-story-id="story.id" />
          </v-col>
          <v-col
            class="columns"

            cols="4"
          >
            <sprints-column
              :user-story-id="story.id"
            />
          </v-col>
          <v-col
            class="columns"

            cols="3"
          >
            <done-column
              :user-story-id="story.id"
            />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import USColumnStart from './Columns/USColStart.vue';
import USColumnEnd from './Columns/USColEnd.vue';
import SPColumnMiddle from './Columns/SPColMid.vue';
import gqlQueries from '../../graphql/gql-queries';

export default {
  name: 'BoardRows',
  components: {
    'sprints-column': SPColumnMiddle,
    'start-column': USColumnStart,
    'done-column': USColumnEnd,
  },
  data: () => ({
    mess: 'hello',
    addBtn: false,
  }),
  computed: {
    ...mapState({
      currPro: (state) => state.currProElements,
    }),
    proId() {
      return this.$route.query.proId;
    },
  },
  mounted() {
    const self = this;
    const observer = this.$apollo.subscribe({
      query: gqlQueries.SUB_BACKLOG_UPDATE,
      variables: { proId: this.proId },
    });
    observer.subscribe({
      async next() {
        await self.loadData();
      },
      error(error) {
        console.error(error);
      },
    });
  },
  methods: {
    ...mapActions([
      'fetchBackLogData',
      'fetchCurrProElements',
      'nTicDialogShow',
      'sPlannerShow',
    ]),
    async loadData() {
      await this.fetchCurrProElements(this.proId);
      await this.fetchBackLogData(this.proId);
    },
    nTicShow() {
      this.nTicDialogShow({ show: true });
    },
    sPlanShow() {
      this.sPlannerShow({ show: true, proId: this.currPro.id });
    },
  },
};
</script>

<style scoped>
  .containers {
    width: 100%;
    grid-gap: 10px;
    display: grid;
    grid-auto-rows: 12rem;
  }
  .v-toolbar__extension {
    height: 0!important;
  }
</style>
