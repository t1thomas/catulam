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
export default {
  name: 'NotFoundCard',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    message() {
      switch (this.type) {
        case 'Sprint':
          return { title: '0 Sprints Found', subtitle: 'Add new Sprint' };
        case 'UStory':
          return { title: '0 User Stories Found', subtitle: 'Add new User Story' };
        case 'Ticket':
          return { title: '0 Tickets Found', subtitle: 'Add new Ticket' };
        default:
          return null;
      }
    },
  },
};
</script>

<style scoped>

</style>
<!--sPlanDialog-->
<!--set_sPlanShow-->
<!--sPlannerShow-->

<!--sPlanShow-->
