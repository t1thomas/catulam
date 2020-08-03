<template>
  <tr>
    <td>
      User Story:
    </td>
    <td v-if="ticket.userStory !== null">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <span
            class="d-inline-block text-truncate"
            style="max-width: 250px;"
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

</style>
