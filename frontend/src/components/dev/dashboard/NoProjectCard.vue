<template>
  <v-container fluid>
    <v-card
      ripple
      tile
      style="background: rgb(39, 54, 102)"
    >
      <v-card-title
        class="headline"
        v-text="title"
      />
      <v-card-subtitle v-text="subtitle" />
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'NoProjectCard',
  computed: {
    title() {
      return '0 Projects Found';
    },
    subtitle() {
      return 'You have not been allocated to a project yet';
    },
  },
};
</script>

<style scoped>

</style>
