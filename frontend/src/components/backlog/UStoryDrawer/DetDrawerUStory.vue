<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    right
  >
    <StoryTextBox v-if="drawer" />
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import StoryTextBox from './StoryTextBox.vue';

export default {
  name: 'DetDrawerUStory',
  components: {
    StoryTextBox,
  },
  computed: {
    ...mapState({
      show: (state) => state.detDrawerUStory.show,
      userStoryId: (state) => state.detDrawerUStory.userStoryId,
    }),
    drawer: {
      get() {
        return this.$store.state.detDrawerUStory.show;
      },
      set(val) {
        if (!val) {
          this.$store.dispatch('detDrawUStoryShow', { show: val });
        }
      },
    },
  },
};
</script>

<style scoped>

</style>
