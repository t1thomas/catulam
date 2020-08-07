<template>
  <v-card
    flat
    class="tab-content"
  >
    <v-content class="comment-list">
      <v-list
        dense
      >
        <v-list-item v-if="comments.length === 0">
          <v-list-item-content>
            <v-list-item-title>No comments Found</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="comm in comments"
          v-else
          :key="comm.id"
          dense
        >
          <comment-card
            :comment="comm"
          />
        </v-list-item>
      </v-list>
    </v-content>
    <v-container>
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
    </v-container>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import gqlQueries from '@/graphql/gql-queries';
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
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
    ...mapGetters([
      'getGravatar',
      'getCurrentUser',
    ]),
    comments() {
      const { comments } = this.ticket;
      return comments.sort((a, b) => a.timestamp - b.timestamp);
    },
    editing() {
      return this.text.length === 0;
    },
  },
  mounted() {
    this.scrollToEnd();
  },
  methods: {
    async addComment() {
      this.savingProgress();
      await this.$apollo.mutate({
        mutation: gqlQueries.ADD_TICKET_COMMENT,
        fetchPolicy: 'no-cache',
        variables: {
          tick: { id: this.ticket.id },
          message: this.text,
        },
      }).then(() => {
        this.text = '';
        this.savingProgress();
        this.scrollToEnd();
      }).catch((error) => {
        this.savingProgress();
        this.$store.dispatch('snackBarOn', {
          message: `Unable to add Comment ${error}`,
          type: 'error',
        });
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
    height: 100%;
    display: grid;
    grid-template-rows: 25vh auto;
  }
  .comment-list {
    min-height: 100%;
    max-height: 100%;
    overflow-y: auto;
    background-color: #2d2d2d;
  }
</style>
