<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-card class="fill-height">
          <v-list dense>
            <current-sprint @closeDrawer="closeDrawer" />
            <time-estimate />
            <v-list-item>
              <v-list-item-content>Status:</v-list-item-content>
              <v-list-item-content class="align-end">
                1
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="fill-height">
          <v-list dense>
            <v-list-item>
              <v-list-item-content>Created:</v-list-item-content>
              <v-list-item-content class="align-end">
                1
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>UserStory:</v-list-item-content>
              <v-list-item-content class="align-end">
                1
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import timeSelectChip from '../timeSelectChip.vue';
import CurrentSprint from './CurrentSprint.vue';
import timeEstimate from './timeEstimate.vue';

export default {
  name: 'DetailsSection',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    timeSelect: timeSelectChip,
    CurrentSprint,
    timeEstimate,
  },
  data: () => ({
    itemsPerPage: 4,
    items: [
      [
        { title: 'Current Sprint', value: '1' },
        { title: 'Status', value: '1' },
        { title: 'Time Estimate', value: '1' },
      ],
      [
        { title: 'Created', value: '1' },
        { title: 'UserStory', value: '1' },
      ],
    ],
  }),
  computed: {
    ...mapState({
      users: (state) => state.allUserList,
      drawer: (state) => state.detailsDrawer.show,
    }),
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
    sprintInfo() {
      const { sprint } = this.ticket;
      if (sprint !== null) {
        return {
          text: `Sprint ${sprint.sprintNo}`,
        };
      }
      return false;
    },
    status() {
      return this.ticket.done;
    },
    creatorObject() {
      if (this.ticket.creator.length === 0) {
        return null;
      }
      const { id } = this.ticket.creator.User;
      return this.users.find((user) => user.id === id);
    },
    creatorName() {
      return `${this.creatorObject.firstName} ${this.creatorObject.lastName}`;
    },
    creationTime() {
      const { timestamp } = this.ticket.creator;
      const date = new Date(Number(timestamp));
      return date.toLocaleString('en-GB');
    },
    creatorGravatar() {
      return `https://gravatar.com/avatar/${this.creatorObject.avatar}?d=identicon`;
    },
    userStory() {
      const { userStory } = this.ticket;
      if (userStory !== null) {
        return {
          text: `${userStory.storyText}`,
          issNo: userStory.issueNumber,
          to: { path: '/uStory', query: { id: userStory.id } },
        };
      }
      return false;
    },
  },
  methods: {
    closeDrawer() {
      if (this.drawer) {
        this.$store.commit('set_DrawerShow', { show: false });
      }
    },
  },
};
</script>

<style scoped>

</style>
