<template>
    <div class="q-pa-md" style="max-width: 400px">
      <div class="row">
        <div class="col-8">
          <q-select rounded filled
                    v-if="loaded"
                    v-model="model1"
                    :options="getRepoNames"
                    @input="changeOptions"
                    label="Select repo"
          />
          <q-select
            filled
            v-if="loaded"
            v-bind:disable="getDisabledModel1"
            v-model="model2"
            :options="options"
            label="Select Branch to branch from "
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
        </div>
        <div class="col-2" style="align-self: flex-end">
          <q-btn color="primary"
                 v-bind:disable="getDisabledModel2"
                 @click="$emit('sendBranchData', model2)"
          >Continue</q-btn>
        </div>
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
      model1: null,
      model2: null,
      options: [],
      btnDisable: true,
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
    getDisabledModel1() {
      return this.model1 === null;
    },
    getDisabledModel2() {
      return this.model2 === null;
    },
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

</style>
