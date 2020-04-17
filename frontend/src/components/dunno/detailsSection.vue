<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <v-card>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>Current Sprint:</v-list-item-content>
            <router-link
              v-if="sprintInfo"
              class="align-end"
              tag="v-list-item-content"
              style="cursor: pointer"
              :to="sprintInfo.to"
            >
              {{ sprintInfo.text }}
            </router-link>
            <v-list-item-content
              v-else
              class="align-end"
            >
              Add ticket to sprint
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>Status</v-list-item-content>
            <v-list-item-content class="align-end" v-if="status">
              Completed
            </v-list-item-content>
            <v-list-item-content class="align-end" v-else>
              Uncompleted
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>Carbs:</v-list-item-content>
            <v-list-item-content class="align-end">
              defgsdf
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>Protein:</v-list-item-content>
            <v-list-item-content class="align-end">
              defgsdf
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>Sodium:</v-list-item-content>
            <v-list-item-content class="align-end">
              defgsdf
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>Calcium:</v-list-item-content>
            <v-list-item-content class="align-end">
              defgsdf
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>Iron:</v-list-item-content>
            <v-list-item-content class="align-end">
              defgsdf
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      rht
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DetailsSection',
  props: {
    ticket: {
      type: Object,
      required: true,
    },
  },
  computed: {
    sprintInfo() {
      const { sprint } = this.ticket;
      if (sprint !== null) {
        return {
          text: `Sprint ${sprint.sprintNo}`,
          to: { path: '/sprint', query: { id: sprint.id } },
        };
      }
      return false;
    },
    status() {
      return this.ticket.done;
    },
    // ticketInfo1() {
    //   return [{ label: 'Current Sprint', data: this.ticket.sprint }];
    // },
  },
};
</script>

<style scoped>

</style>
