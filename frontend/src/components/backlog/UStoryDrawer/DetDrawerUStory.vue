<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    right
    style="width: 30%"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          Edit User Story
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <StoryTextBox v-if="drawer" />
    <template v-slot:append>
      <div>
        <v-divider />
        <v-btn
          block
          color="#5c535366"
          class="ma-2 white--text"
          @click="showDelDialog"
        >
          Delete User Story
          <v-icon dark>
            mdi-trash-can-outline
          </v-icon>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import StoryTextBox from './StoryTextBox.vue';

export default {
  name: 'DetDrawerUStory',
  components: {
    StoryTextBox,
  },
  computed: {
    userStoryId() {
      return this.$store.state.detDrawerUStory.userStoryId;
    },
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
  methods: {
    showDelDialog() {
      this.$store.dispatch('delUSDialogShow', { show: true, userStoryId: this.userStoryId });
    },
  },
};
</script>

<style scoped>

</style>
