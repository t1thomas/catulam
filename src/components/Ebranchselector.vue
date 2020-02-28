<template>
  <div class="q-pa-sm">
    <div class="row">
      <div class="col-4">
        <span class="selector-label">Repository:</span>
      </div>
      <div class="col-8">
        <q-select
          v-if="loaded"
          v-model="model1"
          filled
          dense
          :options="getRepoNames"
          label="Select Repo"
          @input="changeOptions"
        >
          <template v-slot:prepend>
            <q-icon name="fab fa-github-square" />
          </template>
        </q-select>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <span>Branch From:</span>
      </div>
      <div class="col-8">
        <q-select
          v-if="loaded"
          v-model="model2"
          dense
          filled
          :disable="getDisabledModel1"
          :options="options"
          label="Select Branch"
          color="teal"
          options-selected-class="text-deep-orange"
        >
          <template v-slot:prepend>
            <q-icon name="mdi-source-repository" />
          </template>
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
                <q-item-label caption>
                  Last Commit
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>

    <q-btn
      color="primary"
      :disable="getDisabledModel2"
      @click="$emit('sendBranchData', model2)"
    >
      Continue
    </q-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Repoandbranchselector',
  props: {
    selectorOpertation: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loaded: false,
      model1: null,
      model2: null,
      options: [],
      btnDisable: true,
    };
  },
  computed: {
    getOpertaion() {
      return this.selectorOpertation;
    },
    ...mapGetters([
      'getRepoNames',
      'getRepoBranches',
    ]),
    getDisabledModel1() {
      return this.model1 === null;
    },
    getDisabledModel2() {
      return this.model2 === null;
    },
  },
  async mounted() {
    await this.fetchRepoAndBranch();
    this.loaded = true;
  },
  methods: {
    ...mapActions([
      'fetchRepoAndBranch',
    ]),
    changeOptions() {
      this.model2 = null;
      this.options = this.getRepoBranches(this.model1);
    },
  },
};
</script>

<style scoped>
  .row + .row {
    margin-top: 1rem;
  }
</style>
