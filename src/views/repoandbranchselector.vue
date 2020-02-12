<template>
    <div class="q-pa-md" style="max-width: 400px">
      <div class="q-gutter-md">
        <q-select rounded filled v-model="model" :options="getRepoNames" label="Rounded filled" />
        <q-select rounded filled v-model="model" :options="options" label="Rounded filled" />
      </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'repoandbranchselector',
  data() {
    return {
      model: null,
      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle',
      ],
    };
  },
  mounted() {
    this.fetchRepoAndBranch();
  },
  computed: {
    ...mapGetters([
      'getRepoNames',
    ]),
  },
  methods: {
    ...mapActions([
      'fetchRepoAndBranch',
    ]),
    printRepos() {
      console.log(this.getRepoNames);
    },
  },
};
</script>

<style scoped>

</style>
