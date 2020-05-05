<template>
  <v-card color="#5c535366">
    <v-toolbar dense>
      <v-toolbar-title>{{ proTitle }} ({{ proLabel}})</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-speed-dial
        v-model="addBtn"
        right
        direction="left"
        open-on-hover
        transition="slide-x-reverse-transition"
      >
        <template v-slot:activator>
          <v-btn
            small
            v-model="addBtn"
            color="blue darken-2"
            dark
            fab
          >
            <v-icon v-if="addBtn">mdi-close</v-icon>
            <v-icon v-else>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-btn
          fab
          dark
          x-small
          color="#1f4423"
          @click="nTicShow"
        >
          <v-icon>mdi-ticket-confirmation</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          x-small
          color="#17429b66"
        >
          <v-icon>mdi-book-open-variant</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-toolbar>

    <v-divider></v-divider>
    <v-card-text class="pa-2">
      <div class="containers overflow-y-auto" style="height: 80vh" >
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
          v-for="story in stories"
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
import unassignedTicks from './Columns/unassignedTicks.vue';
import gqlQueries from '../../graphql/gql-queries';

export default {
  name: 'BoardRows',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    'sprints-column': SPColumnMiddle,
    'start-column': USColumnStart,
    // eslint-disable-next-line vue/no-unused-components
    'done-column': USColumnEnd,
    // eslint-disable-next-line vue/no-unused-components
    unassignedTicks,
  },
  data: () => ({
    mess: 'hello',
    addBtn: false,
  }),
  computed: {
    ...mapState({
      stories: (state) => state.currProElements.userStories,
      proTitle: (state) => state.currProElements.title,
      proLabel: (state) => state.currProElements.label,
    }),
    proId() {
      return this.$route.query.proId;
    },
    rowHeight() {
      return `calc(100% / ${this.stories.length} * ${this.stories.length + 1} )`;
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
    ]),
    async loadData() {
      await this.fetchCurrProElements(this.proId);
      await this.fetchBackLogData(this.proId);
    },
    nTicShow() {
      this.nTicDialogShow({ show: true });
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
</style>
