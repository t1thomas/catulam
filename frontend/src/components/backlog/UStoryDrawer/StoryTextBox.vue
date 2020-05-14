<template>
  <v-row>
    <v-col>
      <v-textarea
        v-model="text"
        :loading="saving"
        no-resize
        filled
        label="Description"
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
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'StoryTextBox',
  data: () => ({
    text: '',
    disabled: true,
    saving: false,
    editBtn: false,
  }),
  computed: {
    ...mapState({
      userStoryId: (state) => state.detDrawerUStory.userStoryId,
    }),
    storyText() {
      return this.$store.getters.getStoryById(this.userStoryId);
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
    this.text = this.storyText;
  },
  methods: {
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

</style>
