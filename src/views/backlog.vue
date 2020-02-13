<template>
<q-page>
  <div class="crt-btn-container">
    <q-btn color="primary" icon="add" label="On Left" />
  </div>
</q-page>
</template>
<script>
export default {
  name: 'backlog',
};
</script>

<style scoped>
  .crt-btn-container {
    position: absolute;
    left: 8%;
    top: 13%;
  }
</style>
