<template>
  <q-dialog class="dialog-card" v-model="show">
    <q-card>
        <q-stepper v-model="step" ref="stepper" color="primary" animated>
          <q-step :name="1" prefix="1" title="Choose Operation" style="min-height: 200px;">
            <div class="row">
              <div class="col">
                  Create New Branch
                  <q-btn color="primary" @click="proceedWithNewBranch" label="Create New Branch" />
              </div>
              <div class="col">
                Link To Existing Branch
                <q-btn color="primary" @click="linkExistingBranch"
                       label="Link To Existing Branch" />
              </div>
            </div>
          </q-step>
          <q-step :name="2" prefix="2" title="Select Branch" style="min-height: 200px;">
            <div v-if="stepperConfig.operation === 'exist'">
              Existing Branch
                <ebs @sendBranchData="proceedWithBranchData" selector-opertation="exist"/>
            </div>
            <div v-if="stepperConfig.operation === 'new'">
              New Branch
<!--              <nbs @sendBranchData="proceedWithBranchData"/>-->
              <ebs @sendBranchData="proceedWithBranchData" selector-opertation="new"/>
            </div>
          </q-step>
          <q-step :name="3" prefix="3" title="Confirm changes" style="min-height: 200px;">
            <div v-if="stepperConfig.operation === 'exist'">
              Confirm attachemnt of githubbranch to ticket
              <q-btn color="primary"
                     @click="attachBranchToTicket" label="Confirm" class="q-ml-sm" />
            </div>
            <div v-else-if="stepperConfig.operation === 'new'">
              Confirm New Branch name
              <q-input
                clearable
                clear-icon="close"
                filled
                color="green-8"
                v-model="newBranchName"
                label="Label"
              />
              <q-btn color="primary"
                     @click="createNewBranch" label="Confirm" class="q-ml-sm" />
            </div>
          </q-step>
          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn v-if="step > 1" flat color="primary"
                     @click="$refs.stepper.previous()" label="Back" class="q-ml-sm"
                     align="right"
              />
            </q-stepper-navigation>
          </template>

          <template v-slot:message>
            <q-banner v-if="step === 1" class="bg-purple-8 text-white q-px-lg">
              Campaign settings are important...
            </q-banner>
            <q-banner v-else-if="step === 2 && stepperConfig.operation === 'exist'"
                      class="bg-orange-8 text-white q-px-lg">
              Select Repo and branch to branch from
            </q-banner>
            <q-banner v-else-if="step === 2 && stepperConfig.operation === 'new'"
                      class="bg-orange-8 text-white q-px-lg">
              Select Repo and branch to create new branch
            </q-banner>
            <q-banner v-else-if="step === 3" class="bg-green-8 text-white q-px-lg">
              Confirm branch selection..
            </q-banner>
          </template>
        </q-stepper>
    </q-card>
  </q-dialog>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import Ebranchselector from './Ebranchselector.vue';
// import Nbranchselector from './Nbranchselector.vue';

export default {
  name: 'BranchSelector',
  data() {
    return {
      show: false,
      step: 1,
      selectedTicketId: null,
      selectedBranch: null,
      stepperConfig: { operation: '' },
      newBranchName: null,
    };
  },
  components: {
    ebs: Ebranchselector,
    // nbs: Nbranchselector,
  },
  computed: {
    ...mapGetters([
      'getIssueById',
    ]),
  },
  methods: {
    proceedWithNewBranch() {
      this.stepperConfig.operation = 'new';
      this.setNewBranchName();
      this.$refs.stepper.next();
    },
    setNewBranchName() {
      const selectedIssue = this.getIssueById(this.selectedTicketId);
      /* eslint-disable no-underscore-dangle */
      // add issue number to string and issue title (with whitespace removed )
      this.newBranchName = `${selectedIssue.issueNumber}-${(selectedIssue.title).replace(/\s/g, '')}-feat`;
      /* eslint-enable */
    },
    linkExistingBranch() {
      this.stepperConfig.operation = 'exist';
      this.$refs.stepper.next();
    },
    proceedWithBranchData(branchData) {
      this.selectedBranch = branchData;
      this.$refs.stepper.next();
    },
    toggleShow(id) {
      this.resetToDefault();
      this.selectedTicketId = id;
      this.show = !this.show;
    },
    resetToDefault() {
      this.step = 1;
      this.selectedTicketId = null;
      this.selectedBranch = null;
      this.stepperConfig.operation = '';
    },
    async createNewBranch() {
      await Vue.$axios.patch('/createNewBranch', {
        ticketId: this.selectedTicketId,
        repoId: this.selectedBranch.repoId,
        newBranchName: this.newBranchName,
        oid: this.selectedBranch.oid,
      })
        .then((response) => {
          console.log(response.data);
          this.$emit('updateTickets');
        }, (error) => {
          console.error(error);
        });
    },
    async attachBranchToTicket() {
      await Vue.$axios.put('/attachBranchToTicket', { ticketId: this.selectedTicketId, branchData: this.selectedBranch })
        .then((response) => {
          console.log(response.data.message);
          this.$emit('updateTickets');
        }, (error) => {
          console.error(error);
        });
    },
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
