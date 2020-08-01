<template>
  <v-card height="100%">
    <div
      class="d-flex flex-no-wrap"
      style="height: 100%"
    >
      <v-col
        cols="4"
        @mouseenter="editBtn = !editBtn"
        @mouseleave="editBtn = !editBtn"
      >
        <template v-if="noUs">
          <v-card-subtitle>
            Unassigned tickets
          </v-card-subtitle>
        </template>
        <template v-else>
          <v-card-subtitle style="height: 75%">
            {{ storyById(userStoryId) }}
          </v-card-subtitle>
          <v-card-actions class="px-0">
            <v-spacer />
            <v-btn
              v-if="editBtn"
              color="#3a2c2c"
              fab
              x-small
              dark
              style="pointer-events: auto"
              @click="showDrawer({show: true, userStoryId })"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </template>
      </v-col>
      <v-col
        class="pa-0"
        cols="8"
      >
        <draggable-tick-list
          :list-properties="tickListConfig"
          :ticket-ids="tickIds"
        />
      </v-col>
    </div>
  </v-card>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import DraggableTickList from '../DraggableTickList.vue';

export default {
  name: 'USColumnStart',
  components: {
    DraggableTickList,
  },
  props: {
    userStoryId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    editBtn: false,
  }),
  computed: {
    noUs() {
      return this.userStoryId === 'noUs';
    },
    tickListConfig() {
      if (this.noUs) {
        return {
          userStoryId: null,
          columnType: 'start',
          disabled: false,
        };
      }
      return {
        userStoryId: this.userStoryId,
        columnType: 'start',
        disabled: false,
      };
    },
    ...mapGetters({
      storyById: 'getUserStoryText',
      tickIdsUsNoSp: 'getTicksUsNoSp',
      tickIdsNoUsNoSp: 'getTicksNoUsNoSp',
    }),
    tickIds() {
      if (this.noUs) {
        return this.tickIdsNoUsNoSp;
      }
      return this.tickIdsUsNoSp(this.userStoryId);
    },
  },
  methods: {
    ...mapActions({
      showDrawer: 'detDrawUStoryShow',
    }),
  },
};
</script>

<style scoped>

</style>
