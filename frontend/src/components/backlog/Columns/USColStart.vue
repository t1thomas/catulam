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
        <draggable
          tag="div"
          v-bind="dragOptions"
          class="v-list v-list--dense"
          style="background: #17429b66; width: 100%; height: 100%; overflow-y: auto"
          @end="$emit('ticketMove')"
          @add="uSCDAddedTo(listProperties)"
          @remove="uSCDRemovedFrom(listProperties)"
        >
          <ticket-card-slim
            v-for="id in tickIds"
            :key="id"
            :tick-id="id"
          />
        </draggable>
      </v-col>
    </div>
  </v-card>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import draggable from 'vuedraggable';
import ticketCardSlim from '@/components/Ticket/card/ticketCardSlim.vue';

export default {
  name: 'USColumnStart',
  components: {
    draggable,
    ticketCardSlim,
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
    dragOptions() {
      return {
        animation: 200,
        group: 'ticketList',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
    noUs() {
      return this.userStoryId === 'noUs';
    },
    listProperties() {
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
    ...mapActions([
      'uSCDRemovedFrom',
      'uSCDAddedTo',
    ]),
  },
};
</script>

<style scoped>

</style>
