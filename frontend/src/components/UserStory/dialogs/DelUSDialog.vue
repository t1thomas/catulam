<template>
  <v-row
    v-if="showDialog"
    justify="center"
  >
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-alert
                  type="error"
                  icon="mdi-trash-can-outline"
                >
                  Warning! You are about to delete User Story:<br>
                  <span :style="{background: 'grey'}">{{ storyText }}</span>
                </v-alert>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <small>*Any associated Tickets will be moved to Unassigned</small>
          <v-spacer />
          <v-btn
            color="primary darken-1"
            text
            @click="onCancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="onDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'DelUSDialog',
  computed: {
    proId() {
      return this.$route.query.proId;
    },
    ...mapState({
      showDialog: (state) => state.delUSDialog.show,
      userStoryId: (state) => state.delUSDialog.userStoryId,
    }),
    storyText() {
      return this.$store.getters.getUserStoryText(this.userStoryId);
    },
  },
  methods: {
    onCancel() {
      this.$store.dispatch('delUSDialogShow', { show: false });
    },
    async onDelete() {
      const payload = {
        uStory: { id: this.userStoryId },
        project: { id: this.proId },
      };
      console.log(payload);
      await this.$store.dispatch('deleteUserStory', payload);
    },
  },
};
</script>

<style scoped>

</style>
