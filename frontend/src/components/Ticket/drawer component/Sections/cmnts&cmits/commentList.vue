<template>
  <v-card
    flat
    class="tab-content"
  >
    <v-card-text
      class="comment-list pa-0"
    >
      <span
        v-if="comments.length === 0"
        class="not-found"
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
import { mapGetters } from 'vuex';
import commentCard from './commentCard.vue';

export default {
  name: 'CommentList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    commentCard,
  },
  data: () => ({
    text: '',
    comments: [{
      id: 'sdfjghkjdsf',
      userid: '3fce8c48-eb16-4757-b94b-e189eb758e64',
      text: 'I made a comment about why it as a good ilsglksdjfgb;siodfbgv;sdaf sidfg s;dofg ;sg;sdfu g;sdfg ;sdfg ;sdf gs;df g;sdjfgls;dufg ;sdfj g;nts on tickets',
    },
    {
      id: 'eslifgw3497g',
      userid: '184f3c4a-8988-44ef-90ac-2285221a7e00',
      text: 'I made a comment about why it as a good idea to make comments on tickets',
    },
    {
      id: 'seo43ijw',
      userid: 'af12859a-e3a8-4d34-b4db-fa4f3c9b7204',
      text: 'I made a comment about why it as a good idea to make comments on tickets',
    }, {
      id: 'seo43ijwddd',
      userid: 'af12859a-e3a8-4d34-b4db-fa4f3c9b7204',
      text: 'I made a comment about why it as a good idea to make comments on tickets',
    }, {
      id: 'seo412123ijw',
      userid: 'af12859a-e3a8-4d34-b4db-fa4f3c9b7204',
      text: 'I made a comment about why it as a good idea to make comments on tickets',
    }],
  }),

  computed: {
    ...mapGetters([
      'getGravatar',
      'getCurrentUser',
    ]),
    editing() {
      return this.text.length === 0;
    },
  },
};
</script>

<style scoped>
  .tab-content {
    height: inherit;
    display: grid;
    max-width: 34vw;
    grid-template-rows: 80% auto;
  }
  .comment-list {
    min-height: 100%;
    max-height: inherit;
    overflow-y: scroll;
    background-color: #3e3e3e;
  }
</style>
