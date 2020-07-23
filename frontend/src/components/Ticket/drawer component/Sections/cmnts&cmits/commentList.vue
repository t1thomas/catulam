<template>
  <v-card class="fill-height">
    <v-card-text style="height: 80%">
      <span> No comments Found</span>
    </v-card-text>
    <v-card-actions style="height: 20%">
      <v-textarea
        v-model="text"
        auto-grow
        class="mx-2"
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
    comments: [],
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
  .card-container {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 2fr;
  }
</style>
