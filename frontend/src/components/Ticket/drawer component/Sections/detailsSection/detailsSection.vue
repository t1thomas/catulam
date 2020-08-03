<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="6"
        class="pa-0 pr-1"
      >
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <time-estimate />

              <status />
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col
        cols="6"
        class="pa-0"
      >
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <created />
              <current-sprint />
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col
        cols="12"
        class="px-0 pt-1"
      >
        <v-simple-table>
          <template v-slot:default>
            <tbody>
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

export default {
  name: 'DetailsSection',
  components: {
    userStory,
    status,
    CurrentSprint,
    timeEstimate,
    created,
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
