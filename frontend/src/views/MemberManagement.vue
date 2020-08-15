<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="headline">Edit Project Members</span>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          :value="proMembers"
          :disabled="saving"
          :items="filterMembers"
          filled
          chips
          color="blue-grey lighten-2"
          label="Select Members"
          item-text="fullName"
          item-value="id"
          :menu-props="{closeOnContentClick: true}"
          multiple
        >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click:close="remMemDialogShow({ show: true, member: data.item })"
            >
              <v-avatar left>
                <v-img :src="getGravatar(data.item.id)" />
              </v-avatar>
              {{ data.item.fullName }}
            </v-chip>
          </template>
          <template v-slot:item="data">
            <v-list-item
              v-bind="data.attrs"
              :input-value="data.selected"
              @click="add(data.item.id)"
            >
              <v-list-item-avatar>
                <v-img :src="getGravatar(data.item.id)" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="data.item.fullName" />
              </v-list-item-content>
            </v-list-item>
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
        </v-autocomplete>
      </v-card-text>
      <v-col
        cols="2"
        style="align-self: center;"
      >
        <v-btn
          color="primary"
          dark
          @click="print"
        >
          Print
        </v-btn>
      </v-col>
    </v-card>
    <remove-mem-dialog />
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import RemoveMemDialog from '@/components/MemberManagement/RemoveMemDialog.vue';
import gqlQueries from '@/graphql/gql-queries';

export default {
  name: 'MemberManagement',
  components: {
    RemoveMemDialog,
  },
  data: () => ({
    saving: false,
  }),
  computed: {
    ...mapState({
      allUsers: (state) => state.allUserList,
      currUser: (state) => state.currentUser,
    }),
    ...mapGetters([
      'getProjectMembers',
      'getGravatar',
    ]),
    proId() {
      return this.$route.query.proId;
    },
    proMembers() {
      return this.getProjectMembers(this.proId).filter((member) => member.id !== this.currUser.id);
    },
    filterMembers() {
      // filter to get members that are not part of current project's member list
      return this.allUsers.filter((member) => member.id !== this.currUser.id);
    },
  },
  methods: {
    ...mapActions([
      'remMemDialogShow',
    ]),
    setSaving() {
      this.saving = !this.saving;
    },
    async add(memId) {
      this.setSaving();
      await this.$apollo.mutate({
        mutation: gqlQueries.ADD_PROJECT_MEMBER,
        fetchPolicy: 'no-cache',
        variables: {
          member: { id: memId },
          project: { id: this.proId },
        },
      }).then((response) => {
        const { AddProjectMember } = response.data;
        this.$store.dispatch('addProMem', {
          member: AddProjectMember,
          proId: this.proId,
        });
        this.setSaving();
      }).catch((error) => {
        this.setSaving();
        this.snackBarOn({
          message: `Unable to update members: ${error}`,
          type: 'error',
        });
      });
    },
    print(data) {
      console.log(data);
      // console.log(this.proMembers);
    },
  },
};
</script>

<style scoped>

</style>
