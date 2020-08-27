<template>
  <v-progress-circular
    v-if="deleting"
    indeterminate
    color="red"
  />
  <v-card
    v-else
    class="mx-auto"
    width="344"
  >
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-4">
          Delete this ticket?
        </v-list-item-title>
        <v-list-item-subtitle
          class="subtitle-1"
        >
          <span :style="{background: '#402d2d'}">'{{ ticket.title }}'</span>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary darken-1"
        text
        @click="$emit('closeOverlay')"
      >
        Cancel
      </v-btn>
      <v-btn
        color="red darken-1"
        @click="deleteTicket"
      >
        <v-icon
          right
          dark
        >
          mdi-trash-can
        </v-icon>
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import gqlQueries from '@/graphql/gql-queries';

export default {
  name: 'DelTicDialog',
  data: () => ({
    deleting: false,
  }),
  computed: {
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
  },
  methods: {
    async deleteTicket() {
      this.setDeleting();
      await this.$apollo.mutate({
        mutation: gqlQueries.DELETE_TICKET,
        fetchPolicy: 'no-cache',
        variables: {
          tick: { id: this.ticket.id },
          project: { id: this.ticket.project.id },
        },
      }).catch((error) => {
        this.setDeleting();
        this.$emit('closeOverlay');
        this.$store.dispatch('snackBarOn', {
          message: `Unable to delete ticket: ${error}`,
          type: 'error',
        });
      });
    },
    setDeleting() {
      this.deleting = !this.deleting;
    },
  },
};
</script>

<style scoped>

</style>
