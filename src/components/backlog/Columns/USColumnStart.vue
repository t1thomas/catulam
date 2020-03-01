<template>
  <div class="q-px-xs q-py-md row q-gutter-sm">
    <q-card
      v-for="(story, index) in userStories"
      :key="story.id"
      class="card"
      style="width: 100%"
      bordered
    >
      <q-card-section horizontal>
        <q-card-section class="col-3 card-text">
          {{ story.storyText }}
        </q-card-section>
        <q-separator vertical />
        <draggable
          v-model="story.attachedTics"
          tag="div"
          v-bind="dragOptions"
          class="rounded-borders q-list q-list--bordered"
          style="background: cadetblue; width: 100%"
        >
          <q-item
            v-for="ticket in TicksById(story.attachedTics)"
            :key="ticket._id"
            v-ripple
            clickable
          >
            <ticketCard :ticket="ticket" />
          </q-item>
        </draggable>
        <portal
          to="destination"
          :order="index + 1"
          class="q-px-xs q-py-md row q-gutter-sm"
        >
          <draggable
            :key="story.id"
            tag="div"
            v-bind="dragOptions"
            class="rounded-borders q-list q-list--bordered"
            style="background: cadetblue; width: 100%"
          >
            <q-item
              v-for="ticket in ComTicksById(story.attachedTics)"
              :key="ticket._id"
              v-ripple
              clickable
            >
              <ticketCard :ticket="ticket" />
            </q-item>
          </draggable>
        </portal>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';
import { Portal } from 'portal-vue';

import backlogTicketQcard from '../../QItemTicketQcard.vue';

export default {
  name: 'USColumnStart',
  components: {
    Portal,
    draggable,
    ticketCard: backlogTicketQcard,
  },
  props: {
    userStories: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      ComTicksById: 'getCompletedTicksByIds',
      TicksById: 'getUnCompleteTicksByIds',
    }),
    dragOptions() {
      return {
        animation: 0,
        group: 'ticket',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
  },
};
</script>

<style scoped>

</style>
