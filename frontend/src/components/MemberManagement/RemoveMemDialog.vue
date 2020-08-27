<template>
  <v-row
    justify="center"
  >
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="600px"
    >
      <v-card v-if="member">
        <v-overlay
          v-if="saving"
          absolute
        >
          <v-progress-circular
            :size="100"
            color="primary"
            indeterminate
          />
        </v-overlay>
        <v-card-title>
          <span class="headline">Remove Project member</span>
        </v-card-title>
        <v-card-text>
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="getGravatar(member.id)" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="member.fullName" />
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-card-actions>
          <small>*Any tickets assigned to {{ member.firstName }} will be set to Unassigned</small>
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
            @click="remove"
          >
            Remove
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import gqlQueries from '../../graphql/gql-queries';

export default {
  name: 'RemoveMemDialog',
  data: () => ({
    saving: false,
  }),
  computed: {
    ...mapState({
      showDialog: (state) => state.remMemDialog.show,
      member: (state) => state.remMemDialog.member,
    }),
    ...mapGetters([
      'getGravatar',
    ]),
    proId() {
      return this.$route.query.proId;
    },
  },
  methods: {
    ...mapActions([
      'snackBarOn',
    ]),
    onCancel() {
      this.$store.dispatch('remMemDialogShow', { show: false });
    },
    setSaving() {
      this.saving = !this.saving;
    },
    async remove() {
      this.setSaving();
      await this.$apollo.mutate({
        mutation: gqlQueries.REMOVE_PROJECT_MEMBER,
        fetchPolicy: 'no-cache',
        variables: {
          member: { id: this.member.id },
          project: { id: this.proId },
        },
      }).then((response) => {
        const { RemoveProjectMember } = response.data;
        this.$store.dispatch('remProMem', {
          member: RemoveProjectMember,
          proId: this.proId,
        });
        this.setSaving();
        this.onCancel();
      }).catch((error) => {
        this.setSaving();
        this.onCancel();
        this.snackBarOn({
          message: `Unable to update members: ${error}`,
          type: 'error',
        });
      });
    },
  },
};
</script>

<style scoped>

</style>
