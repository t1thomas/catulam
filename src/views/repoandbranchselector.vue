<template>
    <div class="q-pa-md" style="max-width: 400px">
      <div class="q-gutter-md">
        <q-select rounded filled v-if="loaded"
                  v-model="model" :options="getRepoNames" label="Rounded filled" />
<!--        <q-select rounded filled v-if="loaded"-->
<!--                  v-model="model" :options="options" label="Rounded filled" />-->
        <q-select
          filled
          v-bind:disable="getdisabled"
          v-model="model1"
          :options="options"
          label="Select Branch"
          color="teal"
          options-selected-class="text-deep-orange"
        >
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>{{ scope.opt.lastCommit }}</q-item-label>
                <q-item-label caption>Last Commit</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn @click="printRepos">test</q-btn>
      </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'repoandbranchselector',
  data() {
    return {
      loaded: false,
      model: [],
      model2: [],
      options: [
        {
          label: 'Google',
          lastCommit: '(10/03/2013 02:00)',
        },
        {
          label: 'Google',
          lastCommit: '(10/03/2013 02:00)',
        },
        {
          label: 'Google',
          lastCommit: '(10/03/2013 02:00)',
        },
        {
          label: 'Google',
          lastCommit: '(10/03/2013 02:00)',
        },
        {
          label: 'Google',
          lastCommit: '(10/03/2013 02:00)',
        },
      ],
    };
  },
  async mounted() {
    await this.fetchRepoAndBranch();
    this.loaded = true;
  },
  computed: {
    ...mapGetters([
      'getRepoNames',
      'getRepoBranches',
    ]),
    getdisabled() {
      if (!this.model.length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    ...mapActions([
      'fetchRepoAndBranch',
    ]),
    /* eslint-disable */
    printRepos() {
      const string = 'test';
      console.log(this.getRepoBranches(string));
    },
  },
};
</script>

<style scoped>

</style>
