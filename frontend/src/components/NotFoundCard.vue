<template>
  <v-container fluid>
    <v-card
      ripple
      tile
      style="background: rgb(39, 54, 102)"
      @click="$emit('createAction')"
    >
      <div
        class="d-flex flex-no-wrap justify-space-between"
        style="height: 100px"
      >
        <div>
          <v-card-title
            class="headline"
          >
            {{ message.title }}
          </v-card-title>

          <v-card-subtitle>
            {{ message.subtitle }}
          </v-card-subtitle>
        </div>

        <v-avatar
          v-if="message.plusBtn"
          size="100"
          tile
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-avatar>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'NotFoundCard',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState([
      'currentUser',
    ]),
    message() {
      switch (this.type) {
        case 'Sprint':
          return {
            title: '0 Sprints Found',
            subtitle: 'Add new Sprint (Open BackLog)',
            plusBtn: true,
          };
        case 'UStory':
          return {
            title: '0 User Stories Found',
            subtitle: 'Add new User Story (Open BackLog)',
            plusBtn: true,
          };
        case 'Ticket':
          return {
            title: '0 Tickets Found',
            subtitle: 'Add new Ticket (Open BackLog)',
            plusBtn: true,
          };
        case 'Project':
          if (this.currentUser.role === 'pm') {
            return {
              title: '0 Projects Found',
              subtitle: 'Create New Project',
              plusBtn: true,
            };
          }
          return {
            title: '0 Projects Found',
            subtitle: 'You have not been allocated to a project yet',
            plusBtn: false,
          };
        case 'Member':
          return {
            title: '0 Members Found',
            subtitle: 'Add Members to Project',
            plusBtn: true,
          };
        default:
          return null;
      }
    },
  },
};
</script>

<style scoped>

</style>
