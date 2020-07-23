<template>
  <v-card
    flat
    width="100%"
    class="mb-1"
    color="#b5b5b5"
  >
    <v-list-item dense>
      <v-list-item-avatar>
        <v-img
          :src="getGravatar(comment.userid)"
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title style="color: black">
          <span class="font-weight-bold">
            {{ getFullName(comment.userid) }}
          </span>
          <span class="font-weight-light">
            @{{ creationTime }}
          </span>
        </v-list-item-title>
        <v-list-item-subtitle style="color: black" v-text="comment.text" />
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CommentCard',
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      'getGravatar',
      'getFullName',
    ]),
    creationTime() {
      const { timestamp } = this.comment;
      const date = new Date(Number(timestamp));
      return date.toLocaleString('en-GB');
    },
  },
};
</script>

<style scoped>

</style>
