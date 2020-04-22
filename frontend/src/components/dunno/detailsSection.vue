<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
      class="px-1"
    >
      <v-card class="fill-height">
        <v-list dense>
          <v-list-item>
            <v-list-item-content>Current Sprint:</v-list-item-content>
            <v-list-item-content
              v-if="sprintInfo"
              class="align-end"
            >
              <router-link
                style="cursor: pointer; max-width: fit-content"
                :to="sprintInfo.to"
              >
                {{ sprintInfo.text }}
              </router-link>
            </v-list-item-content>
            <v-list-item-content
              v-else
              class="align-end"
            >
              Add ticket to sprint
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>Status:</v-list-item-content>
            <v-list-item-content
              v-if="status"
              class="align-end"
            >
              <v-badge
                class="justify-start"
                color="success"
                icon="mdi-check"
                inline
              >
                Completed
              </v-badge>
            </v-list-item-content>
            <v-list-item-content
              v-else
              class="align-end"
            >
              <v-badge
                class="justify-start"
                color="warning"
                dot
                inline
              >
                Uncompleted
              </v-badge>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>Time Estimate:</v-list-item-content>
            <v-list-item-content
              class="align-end"
            >
              <time-select />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col
      cols="12"
      md="6"
      class="px-1"
    >
      <v-card class="fill-height">
        <v-list dense>
          <v-list-item>
            <v-list-item-content>Created:</v-list-item-content>
            <v-list-item-content
              class="align-end"
              style="display: grid"
            >
              <v-chip
                style="max-width: fit-content"
                small
              >
                <v-avatar
                  left
                  size="10"
                >
                  <v-img
                    :src="creatorGravatar"
                  />
                </v-avatar>
                {{ creatorName }}
              </v-chip>
              <span class="body-2">
                @{{ creationTime }}
              </span>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>UserStory:</v-list-item-content>
            <v-list-item-content
              v-if="userStory"
              class="align-end"
            >
              <router-link
                style="cursor: pointer; display: contents"
                :to="userStory.to"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span
                      style="width: 42%; overflow: hidden;
                   text-overflow: ellipsis; white-space: nowrap"
                      v-on="on"
                    >
                      {{ userStory.text }}
                    </span>
                    <span> #{{ userStory.issNo }}</span>
                    <v-badge
                      color="green"
                      icon="mdi-book-open-page-variant"
                      inline
                      class="justify-start"
                    />
                  </template>
                  <span>{{ userStory.text }}</span>
                </v-tooltip>
              </router-link>
            </v-list-item-content>
            <v-list-item-content
              v-else
              class="align-end"
            >
              Add UserStory
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';
import timeSelectChip from './timeSelectChip.vue';

export default {
  name: 'DetailsSection',
  components: {
    timeSelect: timeSelectChip,
  },
  computed: {
    ...mapState({
      ticket: 'currentTicket',
      users: 'allUserList',
    }),
    sprintInfo() {
      const { sprint } = this.ticket;
      if (sprint !== null) {
        return {
          text: `Sprint ${sprint.sprintNo}`,
          to: { path: '/sprint', query: { sprintId: sprint.id } },
        };
      }
      return false;
    },
    status() {
      return this.ticket.done;
    },
    creatorObject() {
      if (this.ticket.creator === null) {
        return null;
      }
      const { id } = this.ticket.creator[0].User;
      return this.users.find((user) => user.id === id);
    },
    creatorName() {
      return `${this.creatorObject.firstName} ${this.creatorObject.lastName}`;
    },
    creationTime() {
      const { timestamp } = this.ticket.creator[0];
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
    async print() {
      const { id } = this.ticket.creator[0].User;

      const { timestamp } = this.ticket.creator[0];
      console.log(id);
      console.log(timestamp);
      const creator = this.users.find((user) => user.id === id);
      console.log(creator);
      const date = new Date(Number(timestamp));
      console.log(date.toLocaleString('en-GB'));
    },
  },
};
</script>

<style scoped>

</style>
