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
        <v-card-title>
          <span class="headline">Edit Project Members</span>
        </v-card-title>
        <v-card-text>
          <v-form
            v-if="allUsers"
            ref="proForm"
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
              <v-col cols="10">
                <v-autocomplete
                  v-model="selected"
                  :disabled="saving"
                  :items="getAllMembers()"
                  filled
                  chips
                  label="Add Members"
                  multiple
                  item-text="fullName"
                  item-value="id"
                >
                  <template v-slot:selection="data">
                    <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      close
                      @click:close="remove(data.item)"
                    >
                      <v-avatar left>
                        <v-img :src="gravatar(data.item)" />
                      </v-avatar>
                      {{ data.item.fullName }}
                    </v-chip>
                  </template>
                  <template v-slot:item="data">
                    <v-list-item-avatar>
                      <img :src="gravatar(data.item)">
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ data.item.fullName }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col
                cols="2"
                style="align-self: center;"
              >
                <v-btn
                  color="primary"
                  dark
                  :disabled="(selected.length<=0)"
                  @click="addMembers"
                >
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12">
                <mem-list @savingAnimation="setSaving" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary darken-1"
            text
            @click="onCancel"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import currMemList from './currMemList.vue';
import gqlQueries from '../../../../graphql/gql-queries';

export default {
  name: 'EditMemberDialog',
  components: {
    'mem-list': currMemList,
  },
  data: () => ({
    saving: false,
    valid: true,
    selected: [],
  }),
  computed: {
    ...mapState({
      currUser: (state) => state.currentUser,
      showDialog: (state) => state.editMemDialog.show,
      proId: (state) => state.editMemDialog.proId,
      allUsers: (state) => state.allUserList,
      proMemberIds: (state) => state.currProElements.members.map((member) => member.User.id),
    }),
    selectedProvided() {
      return this.selected.length > 0;
    },
  },
  methods: {
    ...mapActions([
      'showEditMemDialog',
      'snackBarOn',
      'fetchCurrProElements',
    ]),
    getAllMembers() {
      // get all members apart from current User (PM)
      const allMembers = this.$store.getters.getUserSelection(this.currUser.id);
      // filter all members to get members that are not in current project
      return allMembers.filter((member) => !this.proMemberIds.includes(member.id));
    },
    gravatar(user) {
      return `https://gravatar.com/avatar/${user.avatar}?d=identicon`;
    },
    onCancel() {
      this.showEditMemDialog({ show: false });
    },
    setSaving() {
      this.saving = !this.saving;
    },
    remove(user) {
      const index = this.selected.indexOf(user.id);
      if (index >= 0) this.selected.splice(user.id, 1);
    },
    async addMembers() {
      this.setSaving();
      await this.$apollo.mutate({
        mutation: gqlQueries.ADD_PROJECT_MEMBER,
        fetchPolicy: 'no-cache',
        variables: {
          members: this.selected.map((id) => ({ id })),
          project: { id: this.proId },
        },
      }).then(async () => {
        this.setSaving();
        this.selected = [];
        // show success notification
        this.snackBarOn({
          message: 'Updated Project Members Successfully',
          type: 'success',
        });
        await this.fetchCurrProElements(this.proId);
        // update the store so new members are shown
      }).catch((error) => {
        this.setSaving();
        this.snackBarOn({
          message: error,
          type: `Unable to update members: ${error}`,
        });
      });
    },
  },
};
</script>

<style scoped>

</style>
