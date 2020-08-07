<template>
  <v-row
    justify="center"
  >
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Create User Story</span>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="uStoryForm"
            v-model="valid"
            :lazy-validation="false"
          >
            <v-overlay
              absolute
              :value="saving"
            >
              <v-progress-circular
                :size="150"
                color="primary"
                indeterminate
              />
            </v-overlay>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="desc"
                  filled
                  label="Story Text*"
                  :rules="[descMessage]"
                  required
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <small>*indicates required field</small>
          <v-spacer />
          <v-btn
            color="primary darken-1"
            text
            @click="onCancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="onCreate"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import gqlQueries from '@/graphql/gql-queries';

export default {
  name: 'NUStoryDialog',
  data: () => ({
    desc: '',
    saving: false,
    valid: true,
  }),
  computed: {
    proId() {
      return this.$route.query.proId;
    },
    ...mapState({
      showDialog: (state) => state.nUStoryDialog.show,
      currUser: (state) => state.currentUser,
    }),
  },
  methods: {
    ...mapActions([
      'nUStoryDialogShow',
      'snackBarOn',
    ]),
    descMessage(val) {
      if (!val > 0) {
        return 'Field is Required';
      }
      return true;
    },
    onCancel() {
      this.nUStoryDialogShow({ show: false });
      this.$refs.uStoryForm.reset();
    },
    async onCreate() {
      if (this.$refs.uStoryForm.validate()) {
        this.setSaving();
        await this.$apollo.mutate({
          mutation: gqlQueries.CREATE_USER_STORY,
          fetchPolicy: 'no-cache',
          variables: {
            storyText: this.desc,
            project: { id: this.proId },
          },
        }).then(() => {
          this.setSaving();
          this.onCancel();
        }).catch((error) => {
          this.setSaving();
          this.onCancel();
          this.$store.dispatch('snackBarOn', {
            message: `Unable to Create User Story: ${error}`,
            type: 'error',
          });
        });
      }
    },
    setSaving() {
      this.saving = !this.saving;
    },
  },
};
</script>

<style scoped>

</style>
