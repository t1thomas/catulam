<template>
  <v-container
    v-if="dataLoaded"
    class="fill-height d-inline-block"
  >
    <topSection />
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
    dataLoaded() {
      return this.ticket !== null && this.project !== null;
    },
    tickId() {
      return this.$route.query.tickId;
    },
    proId() {
      return this.$route.query.proId;
    },
    ...mapState({
      ticket: 'currentTicket',
      project: 'currentProject',
    }),
  },
  async mounted() {
    await this.fetchCurrTicket(this.tickId);
    await this.fetchCurrProject(this.proId);
    console.log(this.ticket);
    console.log(this.project);
  },
  methods: {
    ...mapActions([
      'fetchCurrTicket',
      'fetchCurrProject',
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
