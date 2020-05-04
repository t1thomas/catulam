<template>
  <v-content
    class="fill-height containers">
    <v-row
      class="mb-2"
      no-gutters
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
      class="mb-2"
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
  </v-content>
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
  }),
  computed: {
    ...mapState({
      stories: (state) => state.currProElements.userStories,
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
    ]),
    async loadData() {
      await this.fetchCurrProElements(this.proId);
      await this.fetchBackLogData(this.proId);
    },
  },
};
</script>

<style scoped>
  .containers {
    display: grid;
    grid-template-rows: auto;
  }
</style>
