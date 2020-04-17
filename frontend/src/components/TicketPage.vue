<template>
  <v-container
    v-if="ticket !== null"
    class="fill-height d-inline-block"
  >
    <topSection
      :issue-no="ticket.issueNumber"
      :title="ticket.title"
    />
    <v-divider />
    <detailsSection :ticket="ticket" />
  </v-container>
</template>

<script>
import Vue from 'vue';
import gqlQueries from '../graphql/gql-queries';
import topSection from './dunno/topSection.vue';
import detailsSection from './dunno/detailsSection.vue';

export default {
  name: 'TicketPage',
  components: {
    topSection,
    detailsSection,
  },
  data: () => ({
    ticket: null,
  }),
  computed: {
    id() {
      return this.$route.query.id;
    },
  },
  async mounted() {
    await this.getTicket();
    console.log(this.ticket);
  },
  methods: {
    async getTicket() {
      await Vue.$apolloClient.query({
        query: gqlQueries.TICKET_INFO,
        fetchPolicy: 'no-cache',
        variables: { id: this.id },
      })
        .then((response) => {
          const { Ticket } = response.data;
          // eslint-disable-next-line prefer-destructuring
          this.ticket = Ticket[0];
        })
        .catch((error) => {
          console.log('User not found');
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>

</style>
