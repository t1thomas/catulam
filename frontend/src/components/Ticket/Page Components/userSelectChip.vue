<template>
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
        v-on="on"
      >
        <v-avatar left>
          <v-progress-circular
            v-if="saving"
            indeterminate
            color="amber"
          />
          <v-img
            v-else-if="assignee"
            :src="gravatar(assignee)"
          />
          <v-icon
            v-else
            dark
          >
            mdi-help-circle
          </v-icon>
        </v-avatar>
        {{ fullName(assignee) }}
        <v-icon
          dark
          class="ml-2"
        >
          mdi-pencil-outline
        </v-icon>
      </v-chip>
    </template>
    <v-card max-width="fit-content">
      <v-list>
        <v-list-item
          v-for="member in members"
          :key="member.id"
          class="member-item"
        >
          <v-list-item-avatar size="25">
            <v-img :src="gravatar(member)" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-subtitle>{{ fullName(member) }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              v-if="isAssignee(member)"
              icon
              @click="removeAssignee(member)"
            >
              <v-icon color="red">
                mdi-close-circle
              </v-icon>
            </v-btn>
            <v-btn
              v-else
              class="btn-tick"
              icon
              small
              outlined
              @click="changeAssignee(member)"
            >
              <v-icon>
                mdi-check-circle
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'SelectorChip',
  data: () => ({
    selector: false,
    saving: false,
  }),
  computed: {
    ...mapState({
      ticket: 'currentTicket',
      project: 'currProElements',
    }),
    proId() {
      return this.$route.query.proId;
    },
    members() {
      return this.project.members.map((member) => member.User);
    },
    assignee() {
      if (this.ticket.assignee === null) {
        return null;
      }
      return this.members.find((member) => member.id === this.ticket.assignee.id);
    },
  },
  methods: {
    ...mapActions([
      'updateTicketAssignee',
    ]),
    gravatar(user) {
      return `https://gravatar.com/avatar/${user.avatar}?d=identicon`;
    },
    fullName(user) {
      if (user === null) {
        return 'Unassigned';
      }
      return `${user.firstName} ${user.lastName}`;
    },
    isAssignee(user) {
      return user === this.assignee;
    },
    async removeAssignee(member) {
      this.saving = true;
      // construct variable payload for graphQL mutation
      const payload = {
        remUser: { id: member.id },
        tick: { id: this.ticket.id },
        project: { id: this.proId },
      };
      // Fires a mutation to remove assignee of current ticket
      await this.updateTicketAssignee(payload);
      this.saving = false;
    },
    async changeAssignee(member) {
      this.saving = true;
      // if no one is currently assigned
      if (this.assignee === null) {
        // construct variable payload for graphQL mutation
        const payload = {
          addUser: { id: member.id },
          tick: { id: this.ticket.id },
          project: { id: this.proId },
        };
        await this.updateTicketAssignee(payload);
      } else {
        const payload = {
          remUser: { id: this.assignee.id },
          addUser: { id: member.id },
          tick: { id: this.ticket.id },
          project: { id: this.proId },
        };
        // Fires a mutation to change assignee of current ticket
        await this.updateTicketAssignee(payload);
      }
      this.saving = false;
      this.selector = false;
    },
  },
};
</script>

<style scoped>
.btn-tick {
  visibility: hidden;
}
.member-item:hover .btn-tick {
  visibility: visible;
}

</style>
