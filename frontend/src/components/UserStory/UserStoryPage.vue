<template>
  <div>UserStory {{ id }}</div>
</template>

<script>
export default {
  name: 'UserStoryPage',
  computed: {
    id() {
      return this.$route.query.id;
    },
  },
};
</script>

<style scoped>

</style>
