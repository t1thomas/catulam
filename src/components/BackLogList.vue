<template>
    <q-list v-if="loaded" bordered class="rounded-borders" style="max-width: 600px">
      <q-item v-for="issue in getIssues" v-bind:key="issue.issueID">
        <q-item-section top>
          <q-item-label lines="1">
            <span class="text-weight-medium">{{issue.issueNumber}}</span>
            <span class="text-grey-8"> - {{issue.title}}</span>
          </q-item-label>
          <q-item-label caption lines="1">
            {{issue.desc}}
          </q-item-label>
        </q-item-section>

        <q-item-section bottom side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
            <q-btn size="12px" flat dense round icon="more_vert" />
            <q-btn class="gt-xs" size="12px" color="primary"
                   icon="account_tree" label="Link Github"
                   v-on:click="$emit('toggleBranchSelector', issue.issueID)"
            />
          </div>
        </q-item-section>
      </q-item>


    </q-list>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'BackLogList',
  data() {
    return {
      loaded: false,
      model1: [],
      model2: [],
      bklgList: [
        {
          projectID: 'firstproject24rrwaefpj',
          issueID: 'ASDFASDFA232323SDF',
          issueNumber: 1,
          created: '2020-02-14T17:52:12.652Z',
          lastEdit: '2020-02-14T18:20:07.537Z',
          githubLink: '',
          assigendTo: 'user2',
          title: 'login page',
          creator: 'user1',
          desc: 'Create Login Page for users to enter credentials',
        },
        {
          projectID: 'firstproject24rrwaefpj',
          issueID: 'ASDFASDh3SDF',
          issueNumber: 2,
          created: '2020-02-14T17:52:12.652Z',
          lastEdit: '2020-02-14T18:20:07.537Z',
          githubLink: '',
          assigendTo: 'user2',
          title: 'Set Up API',
          creator: 'user1',
          desc: 'Create API for backend and frontend communication',
        },
        {
          projectID: 'firstproject24rrwaefpj',
          issueID: 'ASDhklSDF',
          issueNumber: 3,
          created: '2020-02-14T17:52:12.652Z',
          lastEdit: '2020-02-14T18:20:07.537Z',
          githubLink: '',
          assigendTo: 'user2',
          title: 'Landing page',
          creator: 'user1',
          desc: 'Create landing page for user',
        },

      ],
    };
  },
  async mounted() {
    await this.fetchIssues();
    this.loaded = true;
  },
  computed: {
    ...mapState([
      'issueType',
    ]),
    ...mapGetters([
      'getIssues',
    ]),
  },
  methods: {
    ...mapActions([
      'fetchIssues',
    ]),
  },
};
</script>

<style scoped>
/*.q-list-container{*/
/*  display: flex;*/
/*  justify-content: center;*/
/*}*/
</style>
