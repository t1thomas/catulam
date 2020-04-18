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
    <details-section />
    <v-divider />
    <desc-section />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
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
  computed: {
    id() {
      return this.$route.query.id;
    },
    ...mapState({
      ticket: 'currentTicket',
    }),
  },
  async mounted() {
    await this.fetchCurrTicket(this.id);
    console.log(this.ticket);
  },
  methods: {
    ...mapActions([
      'fetchCurrTicket',
    ]),
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
