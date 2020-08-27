<template>
  <v-card
    flat
    style="display: flex"
    width="100%"
    class="mb-1"
    color="#b5b5b5"
  >
    <v-list-item dense>
      <v-list-item-avatar
        class="my-0"
        size="2rem"
      >
        <v-img
          :src="getGravatar(commit.User.id)"
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title style="color: black">
          <span class="font-weight-bold">
            {{ getFullName(commit.User.id) }}
          </span>
          <span class="font-weight-light font-italic">
            @ {{ creationTime }}
          </span>
        </v-list-item-title>
        <v-list-item-subtitle
          class="font-weight-regular"
          style="color: black; white-space: pre-wrap"
          v-text="commit.message"
        />
      </v-list-item-content>
      <v-list-item-icon
        style="place-self: center;"
      >
        <v-icon color="black">
          mdi-github
        </v-icon>
      </v-list-item-icon>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'CommitCard',
  props: {
    commit: {
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
      const { timestamp } = this.commit;
      return moment.unix(timestamp).format('DD-MM-YYYY, HH:MM:SS');
    },
  },
};
</script>

<style scoped>

</style>
