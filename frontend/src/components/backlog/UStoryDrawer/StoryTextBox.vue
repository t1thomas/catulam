<template>
  <v-container>
    <v-textarea
      v-model="text"
      :loading="saving"
      no-resize
      filled
      :disabled="disabled"
      @blur="onBlur"
    >
      <template
        v-if="!saving"
        v-slot:append
        style="display: grid"
      >
        <v-btn
          v-if="editButton"
          color="dark"
          fab
          x-small
          dark
          style="pointer-events: auto"
          @click="disabled = !disabled"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <div
          v-if="!disabled"
          class="edit-btns"
        >
          <v-btn
            ccolor="dark"
            class="mb-2"
            fab
            x-small
            :disabled="!btnUndoSave"
            dark
            style="pointer-events: auto"
            @click="setOriginalText"
          >
            <v-icon>mdi-undo</v-icon>
          </v-btn>
          <v-btn
            color="dark"
            fab
            :disabled="!btnUndoSave"
            x-small
            dark
            style="pointer-events: auto"
            @click="onSave"
          >
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </div>
      </template>
      <template
        v-slot:progress
      >
        <v-progress-linear
          :active="saving"
          indeterminate
          bottom
          absolute
          color="amber"
        />
      </template>
    </v-textarea>
  </v-container>
</template>

<script>
import Vue from 'vue';
import gqlQueries from '../../../graphql/gql-queries';

export default {
  name: 'StoryTextBox',
  data: () => ({
    text: '',
    disabled: true,
    saving: false,
    editBtn: false,
  }),
  computed: {
    userStoryId() {
      return this.$store.state.detDrawerUStory.userStoryId;
    },
    storyText() {
      return this.$store.getters.getUserStoryText(this.userStoryId);
    },
    editButton() {
      return this.disabled && this.checkInputSame;
    },
    btnUndoSave() {
      return this.text !== this.storyText;
    },
    checkInputSame() {
      return this.text === this.storyText;
    },
  },
  mounted() {
    this.setOriginalText();
  },
  methods: {
    async onSave() {
      // starts saving animation
      this.savingProgress();
      this.disabled = true;
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.UPDATE_USER_STORY_TEXT,
        fetchPolicy: 'no-cache',
        variables: { id: this.userStoryId, storyText: this.text },
      })
        .then(() => {
          this.$store.dispatch('snackBarOn', {
            message: 'Story Updated Successfully',
            type: 'success',
          });
        }).catch((error) => {
          this.disabled = false;
          this.$store.dispatch('snackBarOn', {
            message: error,
            type: 'error',
          });
        });
      this.savingProgress();
    },
    setOriginalText() {
      this.text = this.storyText;
    },
    onBlur() {
      if (this.checkInputSame) {
        this.disabled = true;
      }
    },
    savingProgress() {
      this.saving = !this.saving;
    },
  },
};
</script>

<style scoped>
  .edit-btns {
    display: grid;
  }
</style>
