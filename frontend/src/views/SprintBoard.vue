<template>
  <div>Sprints {{id}}</div>
</template>

<script>
export default {
  name: 'SprintBoard',
  computed: {
    id() {
      return this.$route.query.id;
    },
  },
};
</script>

<style scoped>

</style>
