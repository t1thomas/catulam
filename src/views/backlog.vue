<template>
<q-page>
  <div class="crt-btn-container">
    <q-btn class="crt-btn" color="primary" icon="add" rounded  label="Create Issue" />
  </div>
  <div class="bklg-list">
    <BackLogList/>
  </div>
</q-page>
</template>
<script>
import BackLogList from '../components/BackLogList.vue';

export default {
  name: 'backlog',
  components: { BackLogList },
};
</script>

<style scoped>
  .crt-btn-container {
    display: flex;
    align-items: center;
    position: absolute;
    left: 8%;
    top: 13%;
    width: 84vw;
    background: darkgray;
    height: 56px; /* needs to be responsive */
    border-radius: 25px;
  }
  .crt-btn {
    left: 3%;
  }
  .bklg-list {
    display: flex;
    position: absolute;
    top: 20%;
    left: 8%;
    width: 84vw;
    justify-content: center;
  }
</style>
