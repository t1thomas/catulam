<template>
  <v-container>
    <v-list>
      <v-list-item
        v-for="member in proMembers"
        :key="member.User.id"
      >
        <v-list-item-avatar>
          <img :src="gravatar(member.User)">
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="member.User.fullName" />
        </v-list-item-content>
        <v-list-item-icon>
          <v-btn
            icon
            color="red"
            @click="removeDialog(member)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
    <v-dialog
      v-model="showDialog"
      max-width="300px"
    >
      <v-card>
        <v-card-title>
          <span>Confirm Removal ?</span>
          <v-list-item
            v-if="remMember"
          >
            <v-list-item-avatar>
              <img :src="gravatar(remMember.User)">
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="remMember.User.fullName" />
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="onCancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red"
            @click="confirmRemoval()"
          >
            Remove
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import gqlQueries from '../../../../graphql/gql-queries';

export default {
  name: 'CurrMemList',
  data: () => ({
    showDialog: false,
    remMember: null,
  }),
  computed: {
    ...mapState({
      proId: (state) => state.editMemDialog.proId,
      currUser: (state) => state.currentUser,
    }),
    proMembers() {
      return this.$store.getters.getProMembers_ex_pm;
    },
  },
  methods: {
    ...mapActions([
      'snackBarOn',
      'fetchCurrProElements',
    ]),
    gravatar(user) {
      return `https://gravatar.com/avatar/${user.avatar}?d=identicon`;
    },
    removeDialog(member) {
      this.showDialog = true;
      this.remMember = member;
    },
    onCancel() {
      this.showDialog = false;
      this.remMember = null;
    },
    async confirmRemoval() {
      this.$emit('savingAnimation');
      await this.$apollo.mutate({
        mutation: gqlQueries.REMOVE_PROJECT_MEMBER,
        fetchPolicy: 'no-cache',
        variables: {
          // current implementation only deletes one member at a time,
          // but mutation can accept an array of members
          members: [{ id: this.remMember.User.id }],
          project: { id: this.proId },
        },
      }).then(async () => {
        this.showDialog = false;
        this.remMember = null;
        this.$emit('savingAnimation');
        // show success notification
        this.snackBarOn({
          message: 'Deleted Successfully',
          type: 'success',
        });
        await this.fetchCurrProElements(this.proId);
        // update the store so new members are shown
      }).catch((error) => {
        this.showDialog = false;
        this.remMember = null;
        this.$emit('savingAnimation');
        this.remMember = null;
        this.snackBarOn({
          message: error,
          type: `Unable to Delete members: ${error}`,
        });
      });
    },
  },
};
</script>

<style scoped>

</style>
