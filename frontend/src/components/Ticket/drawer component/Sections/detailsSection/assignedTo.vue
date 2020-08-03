<template>
  <tr>
    <td class="pr-0">Assigned To:</td>
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
            <v-list-item
              v-for="member in members"
              :key="member.id"
              class="member-item"
            >
              <v-list-item-avatar size="25">
                <v-img :src="getGravatar(member.id)" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-subtitle>{{ getFullName(member.id) }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  v-if="assignee !== null && isAssignee(member)"
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
    </td>
  </tr>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AssignedTo',
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
      // construct variable payload for graphQL mutation
      const payload = {
        tick: { id: this.ticket.id },
        project: { id: this.ticket.project.id },
      };
      // Fires a mutation to remove assignee of current ticket
      await this.$store.dispatch('removeTicketAssignee', payload)
        .then(() => {
          this.setSaving();
        })
        .catch(() => {
          this.setSaving();
          this.selector = false;
        });
    },
    async changeAssignee(member) {
      this.saving = true;
      const payload = {
        user: { id: member.id },
        tick: { id: this.ticket.id },
        project: { id: this.ticket.project.id },
      };
      await this.$store.dispatch('updateTicketAssignee', payload)
        .then(() => {
          this.setSaving();
          this.selector = false;
        })
        .catch(() => {
          this.setSaving();
          this.selector = false;
        });
    },
  },
};
</script>

<style scoped>

</style>
