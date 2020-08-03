<template>
  <v-container fluid>
    <v-row dense>
      <v-col
        cols="6"
      >
        <v-simple-table class="fill-height">
          <template v-slot:default>
            <tbody>
              <time-estimate />
              <status />
              <assigned-to />
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col
        cols="6"
      >
        <v-simple-table class="fill-height">
          <template v-slot:default>
            <tbody>
              <created />
              <current-sprint />
              <user-story />
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CurrentSprint from './CurrentSprint.vue';
import timeEstimate from './timeEstimate.vue';
import status from './status.vue';
import created from './created.vue';
import userStory from './userStory.vue';
import assignedTo from './assignedTo.vue';

export default {
  name: 'DetailsSection',
  components: {
    userStory,
    status,
    CurrentSprint,
    timeEstimate,
    created,
    assignedTo,
  },
  data: () => ({
    itemsPerPage: 4,
    desserts: [
      {
        name: 'Frozen Yogurt',
        calories: 159,
      },
      {
        name: 'Ice cream sandwich',
        calories: 237,
      },
    ],
  }),
};
</script>

<style scoped>

</style>
