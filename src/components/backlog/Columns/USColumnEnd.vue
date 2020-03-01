<template>
  <div class="q-px-xs q-py-md row q-gutter-sm">
    <draggable
      v-for="(story) in userStories"
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
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';
import backlogTicketQcard from '../../QItemTicketQcard.vue';

export default {
  name: 'USColumnEnd',
  components: {
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
