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
            <router-link
              v-if="sprintInfo"
              class="align-end"
              tag="v-list-item-content"
              style="cursor: pointer"
              :to="sprintInfo.to"
            >
              {{ sprintInfo.text }}
            </router-link>
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
              Completed
            </v-list-item-content>
            <v-list-item-content
              v-else
              class="align-end"
            >
              Uncompleted
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>Time Estimate:</v-list-item-content>
            <v-list-item-content
              v-if="hourEstimate"
              class="align-end"
            >
              <v-chip
                small
                color="dark-grey"
                text-color="white"
                style="max-width: fit-content"
              >
                <v-avatar
                  left
                >
                  <v-icon>mdi-progress-clock</v-icon>
                </v-avatar>
                {{ hourEstimate }}hr
              </v-chip>
            </v-list-item-content>
            <v-list-item-content
              v-else
              class="align-end"
            >
              Set estimate
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
            <v-list-item-content class="align-end">
              19/04/2020 14:50pm by User name
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>UserStory:</v-list-item-content>
            <v-list-item-content
              v-if="userStory"
              class="align-end"
            >
              {{ userStory.text }}
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
export default {
  name: 'DetailsSection',
  props: {
    ticket: {
      type: Object,
      required: true,
    },
  },
  computed: {
    sprintInfo() {
      const { sprint } = this.ticket;
      if (sprint !== null) {
        return {
          text: `Sprint ${sprint.sprintNo}`,
          to: { path: '/sprint', query: { id: sprint.id } },
        };
      }
      return false;
    },
    status() {
      return this.ticket.done;
    },
    hourEstimate() {
      return this.ticket.hourEstimate;
    },
    userStory() {
      const { userStory } = this.ticket;
      if (userStory !== null) {
        return {
          text: `# ${userStory.issueNumber}`,
          to: { path: '/uStory', query: { id: userStory.id } },
        };
      }
      return false;
    },
  },
};
</script>

<style scoped>

</style>
