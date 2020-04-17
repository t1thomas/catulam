<template>
  <v-container
    v-if="currentTicket !== null"
    class="fill-height d-inline-block"
  >
    <topSection
      :issue-no="ticket.issueNumber"
      :title="ticket.title"
    />
    <v-divider />
    <detailsSection :ticket="ticket" />
    <v-divider />
    <desc-section :ticket-id="id" />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Vue from 'vue';
import gqlQueries from '../graphql/gql-queries';
import topSection from './dunno/topSection.vue';
import detailsSection from './dunno/detailsSection.vue';
import descSection from './dunno/descSection.vue';

export default {
  name: 'TicketPage',
  components: {
    topSection,
    detailsSection,
    descSection,
  },
  data: () => ({
    ticket: null,
  }),
  computed: {
    id() {
      return this.$route.query.id;
    },
    ...mapState([
      'currentTicket',
    ]),
  },
  async mounted() {
    await this.getTicket();
    await this.fetchCurrTicket(this.id);
    console.log(this.ticket);
  },
  methods: {
    ...mapActions([
      'fetchCurrTicket',
    ]),
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
          console.log('Unable to fetch Ticket');
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>

</style>
<!--id: ID!-->
<!--issueNumber: Int!-->
<!--hourEstimate: Int-->
<!--userStory: UserStory @relation(name: "SUB_TASK", direction: OUT)-->
<!--title: String!-->
<!--desc: String-->
<!--done: Boolean!-->
<!--sprint: Sprint @relation(name: "SPRINT_TASK", direction: OUT)-->
<!--project: Project @relation(name: "TICKET", direction: OUT)-->
<!--assignee: User @relation(name: "ASSIGNED_TASK", direction: IN)-->
<!--creator: User @relation(name: "CREATOR", direction: OUT)-->
