<template>
  <tr>
    <td>
      User Story:
    </td>
    <td
      v-if="ticket.userStory !== null"
      class="pl-0"
    >
      <v-tooltip bottom max-width="15.625rem">
        <template v-slot:activator="{ on }">
          <span
            class="caption story-text"
            v-on="on"
          >
            {{ userStory.storyText }}
          </span>
        </template>
        <span>
          {{ userStory.storyText }}
        </span>
      </v-tooltip>
    </td>
    <td v-else>
      N/a
    </td>
  </tr>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'UserStory',
  computed: {
    ...mapGetters({
      ticket: 'getCurrTick',
      getStory: 'getUserStoryByID',
    }),
    userStory() {
      return this.getStory(this.ticket.userStory.id);
    },
  },
};
</script>

<style scoped>
.story-text {
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  white-space: initial;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
