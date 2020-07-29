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
        :loading="saving"
        :disabled="saving"
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
            @click="addComment"
          >
            <v-icon small>
              mdi-send
            </v-icon>
          </v-btn>
        </template>
        <template
          v-slot:progress
        >
          <v-progress-linear
            active
            indeterminate
            bottom
            absolute
            color="amber"
          />
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
    commentCard,
  },
  data: () => ({
    text: '',
    saving: false,
  }),
  computed: {
    ...mapGetters([
      'getGravatar',
      'getCurrentUser',
      'getTicketComments',
      'getTicketProject',
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
    proId() {
      return this.getTicketProject(this.ticketId);
    },
  },
  mounted() {
    this.scrollToEnd();
  },
  methods: {
    async addComment() {
      this.savingProgress();
      const payload = {
        ticket: { id: this.ticketId },
        message: this.text,
        project: { id: this.proId },
      };
      await this.$store.dispatch('addTicketComment', payload)
        .then(() => {
          this.text = '';
          this.savingProgress();
          this.scrollToEnd();
        })
        .catch(() => {
          this.savingProgress();
        });
    },
    scrollToEnd() {
      const container = this.$el.querySelector('.comment-list');
      container.scrollTop = container.scrollHeight;
    },
    savingProgress() {
      this.saving = !this.saving;
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
