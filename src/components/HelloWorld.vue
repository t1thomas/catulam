<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <a href="https://github.com/login/oauth/authorize?client_id=Iv1.bf366849374cf879&scope=user public_repo repo repo_deployment repo:status read:repo_hook read:org read:public_key read:gpg_key">Link Github Repo</a>
    <br><br>

  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  mounted() {
    // this.sendTempCode();
  },
  methods: {
    getRepoList() {
      if (this.$route.query.code) {
        // console.log(this.$route.query.code);
        Vue.$axios.get('/repoList', { code: this.$route.query.code })
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
