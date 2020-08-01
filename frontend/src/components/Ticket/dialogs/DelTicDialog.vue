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
        @click="$emit('closeDialog')"
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
import { mapActions, mapState } from 'vuex';
import gqlQueries from '../../../graphql/gql-queries';

export default {
  name: 'DelTicDialog',
  data: () => ({
    deleting: false,
  }),
  computed: {
    ...mapState({
      ticket: 'currentTicket',
    }),
  },
  methods: {
    ...mapActions([
      'snackBarOn',
    ]),
    async deleteTicket() {
      this.deleting = true;
      await this.$apollo.mutate({
        mutation: gqlQueries.DELETE_TICKET,
        fetchPolicy: 'no-cache',
        variables: {
          ticket: { id: this.ticket.id },
          project: { id: this.ticket.project.id },
        },
      }).then(() => {
        this.snackBarOn({
          message: 'Deleted Successfully',
          type: 'success',
        });
        this.deleting = false;
        this.$store.commit('set_DrawerShow', { show: false });
      }).catch((error) => {
        this.deleting = false;
        this.$emit('closeDialog');
        this.snackBarOn({
          message: error,
          type: 'error',
        });
      });
    },
  },
};
</script>

<style scoped>

</style>
