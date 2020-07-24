<template>
  <v-card
    flat
    class="tab-content"
  >
    <v-card-text
      class="comment-list pa-0"
    >
      <span
        v-if="getTicketComments(ticketId).length === 0"
      > No comments Found</span>
      <v-list
        v-else
        dense
      >
        <v-list-item
          v-for="comm in comments"
          :key="comm.id"
          dense
        >
          <comment-card
            :comment="comm"
          />
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-textarea
        v-model="text"
        auto-grow
        class="ma-0"
        label="Add a comment"
        rows="2"
        dense
        hide-details
      >
        <template
          v-slot:prepend
        >
          <v-avatar size="1.8rem">
            <v-img
              :src="getGravatar(getCurrentUser.id)"
            />
          </v-avatar>
        </template>
        <template
          v-slot:append
        >
          <v-btn
            fab
            x-small
            dark
            :disabled="editing"
            style="pointer-events: auto"
          >
            <v-icon small>
              mdi-send
            </v-icon>
          </v-btn>
        </template>
      </v-textarea>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import commentCard from './commentCard.vue';

export default {
  name: 'CommentList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    commentCard,
  },
  data: () => ({
    text: '',
  }),
  computed: {
    ...mapGetters([
      'getGravatar',
      'getCurrentUser',
      'getTicketComments',
    ]),
    ...mapState({
      ticketId: (state) => state.detailsDrawer.ticketId,
    }),
    editing() {
      return this.text.length === 0;
    },
    comments() {
      return this.getTicketComments(this.ticketId).sort((a, b) => a.timestamp - b.timestamp);
    },
  },
};
</script>

<style scoped>
  .tab-content {
    height: inherit;
    max-height: inherit;

    display: grid;
    max-width: 34vw;
    grid-auto-rows: 75% auto;
  }
  .comment-list {
    min-height: 100%;
    max-height: 100%;
    overflow-y: auto;
    background-color: #3e3e3e;
  }
</style>
