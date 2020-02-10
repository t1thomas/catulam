<template>
  <div>
  <label>Repo:
    <select name="cars" style="width: 150px">
      <option value="volvo">Volvo</option>
      <option value="saab">Saab</option>
      <option value="fiat">Fiat</option>
      <option value="audi">Audi</option>
    </select>
  </label>
  <label>Branch:
    <select name="cars" style="width: 150px">
      <option value="volvo">Volvo</option>
      <option value="saab">Saab</option>
      <option value="fiat">Fiat</option>
      <option value="audi">Audi</option>
    </select>
  </label>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'repoandbranchselector',
  mounted() {
    this.fetchRepoAndBranch();
  },
  methods: {
    ...mapActions([
      'fetchRepoAndBranch',
    ]),
  },
};
</script>

<style scoped>

</style>
