<template>
  <div>Sprints {{sprintId}}</div>
</template>

<script>
export default {
  name: 'SprintBoard',
  computed: {
    sprintId() {
      return this.$route.query.sprintId;
    },
  },
};
</script>

<style scoped>

</style>
