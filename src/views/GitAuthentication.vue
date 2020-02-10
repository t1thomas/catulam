<template>
  <div class="loading">
    <h1>Validating Git Authentication</h1>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'GitAuth',
  mounted() {
    this.sendTempCode();
  },
  methods: {
    sendTempCode() {
      if (this.$route.query.code) {
        // console.log(this.$route.query.code);
        Vue.$axios.post('/tempCode', { code: this.$route.query.code })
          .then((response) => {
            console.log(response.data);
          }, (error) => {
            console.error(`error ${error}`);
          });
      }
    },
  },
};
</script>

<style scoped>

</style>
