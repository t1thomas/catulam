<template>
  <q-dialog class="dialog-card" v-model="show">
    <q-card>
        <q-stepper v-model="step" ref="stepper" color="primary" animated>
          <q-step :name="1" prefix="1" title="Select campaign settings" style="min-height: 200px;">
            <div class="row">
              <div class="col">
                  Create New Branch
                  <q-btn color="primary" label="Create New Branch" />
              </div>
              <div class="col">
                Link To Existing Branch
                <q-btn color="primary" label="Link To Existing Branch" />
              </div>
            </div>
          </q-step>
          <q-step :name="2" prefix="2" title="Create an ad group" caption="Optional"
                  style="min-height: 200px;">
            An ad group contains one or more ads which target a shared set of keywords.
          </q-step>
          <q-step :name="3" prefix="3" title="Create an ad" style="min-height: 200px;">
            Try out different ad text to see what brings in the most customers, and learn how to
            enhance your ads using features like ad extensions. If you run into any problems with
            your ads, find out how to tell if they're running and how to resolve approval issues.
          </q-step>
          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn @click="$refs.stepper.next()" color="primary"
                     :label="step === 3 ? 'Finish' : 'Continue'" />
              <q-btn v-if="step > 1" flat color="primary"
                     @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
            </q-stepper-navigation>
          </template>

          <template v-slot:message>
            <q-banner v-if="step === 1" class="bg-purple-8 text-white q-px-lg">
              Campaign settings are important...
            </q-banner>
            <q-banner v-else-if="step === 2" class="bg-orange-8 text-white q-px-lg">
              The ad group helps you to...
            </q-banner>
            <q-banner v-else-if="step === 3" class="bg-green-8 text-white q-px-lg">
              The Ad template is disabled - this won't be displayed
            </q-banner>
            <q-banner v-else class="bg-blue-8 text-white q-px-lg">
              The final step is creating the ad...
            </q-banner>
          </template>
        </q-stepper>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'BranchSelector',

  data() {
    return {
      show: false,
      step: 1,
      loaded: false,
      model1: [],
      model2: [],
      options: [],
    };
  },
  async mounted() {
    // await this.fetchRepoAndBranch();
    this.loaded = true;
  },
  computed: {
    ...mapGetters([
      'getRepoNames',
      'getRepoBranches',
    ]),
    getDisabled() {
      return !this.model1.length > 0;
    },
  },
  watch: {
    model1() {
      this.model2 = [];
      this.changeOptions(this.model1);
    },
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    ...mapActions([
      'fetchRepoAndBranch',
    ]),
    /* eslint-disable */
      printRepos() {
        const string = 'test';
        console.log(this.getRepoBranches(string));
      },
      changeOptions(repoName){
        this.options = this.getRepoBranches(repoName);
      }
    },
};
</script>

<style scoped>
  /*.dialog-card {*/
  /*  min-width: 600px !important;*/
  /*  height: 50vh;*/
  /*}*/
  .row > div {
    height: 150px;
    padding: 10px 15px;
    background: rgba(86, 61, 124, .15);
    border: 1px solid rgba(86, 61, 124, .2);

  }
.q-dialog__inner--minimized > div {
  max-width: 600px !important;
  min-height: 50vh !important;
}
</style>
