<template>
  <v-container>
    <v-btn
      block
      color="#501d1d"
      @click="$emit('delDialog')"
    >
      <v-icon
        left
        dark
      >
        mdi-trash-can
      </v-icon>
      Delete Ticket
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'DeleteSection',
};
</script>

<style scoped>

</style>
