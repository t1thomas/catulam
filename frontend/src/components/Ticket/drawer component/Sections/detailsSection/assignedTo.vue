<template>
  <tr>
    <td class="pr-0">
      Assigned To:
    </td>
    <td class="pa-0">
      <v-menu
        v-model="selector"
        offset-y
        right
        :close-on-content-click="false"
        transition="scale-transition"
        origin="top left"
      >
        <template v-slot:activator="{ on }">
          <v-chip
            pill
            small
            v-on="on"
          >
            <v-avatar left>
              <v-progress-circular
                v-if="saving"
                indeterminate
                color="amber"
              />
              <v-img
                v-if="assignee !== null"
                :src="getGravatar(assignee.id)"
              />
              <v-icon
                v-else
                small
                dark
              >
                mdi-help-circle
              </v-icon>
            </v-avatar>
            {{ fullName }}
            <v-icon
              dark
              small
              class="ml-2"
            >
              mdi-pencil-outline
            </v-icon>
          </v-chip>
        </template>
        <v-card max-width="fit-content">
          <v-list>
            <member-item
              v-for="member in members"
              :key="member.id"
              :member="member"
              @remove="removeAssignee"
              @change="changeAssignee"
            />
          </v-list>
        </v-card>
      </v-menu>
    </td>
  </tr>
</template>

<script>
import { mapGetters } from 'vuex';
import gqlQueries from '@/graphql/gql-queries';
import memberItem from './memberItem.vue';

export default {
  name: 'AssignedTo',
  components: {
    memberItem,
  },
  data: () => ({
    selector: false,
    saving: false,
  }),
  computed: {
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
    ...mapGetters([
      'getProjectMembers',
      'getGravatar',
      'getFullName',
    ]),
    members() {
      return this.getProjectMembers(this.ticket.project.id);
    },
    assignee() {
      return this.ticket.assignee;
    },
    fullName() {
      if (this.assignee === null) {
        return 'n/a';
      }
      return this.getFullName(this.assignee.id);
    },
  },
  methods: {
    isAssignee(member) {
      return member.id === this.assignee.id;
    },
    setSaving() {
      this.saving = !this.saving;
    },
    async removeAssignee() {
      this.setSaving();
      await this.$apollo.mutate({
        mutation: gqlQueries.REMOVE_TICKET_ASSIGNEE,
        fetchPolicy: 'no-cache',
        variables: { tick: { id: this.ticket.id } },
      }).then(() => {
        this.setSaving();
        this.selector = false;
      }).catch((error) => {
        this.setSaving();
        this.selector = false;
        this.$store.dispatch('snackBarOn', {
          message: `Unable to update Assignee ${error}`,
          type: 'error',
        });
      });
    },
    async changeAssignee(member) {
      this.setSaving();
      await this.$apollo.mutate({
        mutation: gqlQueries.UPDATE_TICKET_ASSIGNEE,
        fetchPolicy: 'no-cache',
        variables: {
          user: { id: member.id },
          tick: { id: this.ticket.id },
        },
      }).then(() => {
        this.setSaving();
        this.selector = false;
      }).catch((error) => {
        this.setSaving();
        this.selector = false;
        this.$store.dispatch('snackBarOn', {
          message: `Unable to update Assignee ${error}`,
          type: 'error',
        });
      });
    },
  },
};
</script>

<style scoped>

</style>
