<template>
  <q-page-container>
    <div class="row">
      <div class="col">
        <draggable
          v-model="bklgList"
          tag="div"
          v-bind="dragOptions"
          class="rounded-borders q-list q-list--bordered"
          style="height: 100%; min-width: 600px; background: cadetblue"
        >
          <q-item
            v-for="issue in bklgList"
            :key="issue._id"
            class="issue-items"
            clickable
          >
            <ticketCard :ticket="issue"/>
          </q-item>
        </draggable>
      </div>
      <div class="col">
        <draggable
          v-model="sprintList"
          tag="div"
          v-bind="dragOptions"
          class="rounded-borders q-list q-list--bordered"
          style="height: 100%; min-width: 600px; background: darkgray"
        >
          <q-item
            v-for="issue in sprintList"
            :key="issue._id"
            class="issue-items"
            clickable
          >
            <ticketCard :ticket="issue"/>
          </q-item>
        </draggable>
      </div>
    </div>
    <!--    <div class="row">-->
    <!--      <div class="col">-->
    <!--        <pre>{{ listString }}</pre>-->
    <!--      </div>-->
    <!--      <div class="col">-->
    <!--        <pre>{{ list2String }}</pre>-->
    <!--      </div>-->
    <!--    </div>-->
  </q-page-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import draggable from 'vuedraggable';
import backlogTicketQcard from './backlogTicketQcard.vue';

export default {
  name: 'BackLogList',
  components: {
    // sortableList,
    draggable,
    ticketCard: backlogTicketQcard,
  },
  data() {
    return {
      loaded: false,
      model1: [],
      model2: [],
      sprintList: [],
      bklgList: [
        {
          _id: '5e4d982360b45418a87cbaf3',
          projectID: 'firstproject24rrwaefpj',
          issueNumber: 1,
          hourEstimate: 3,
          created: '2020-02-14T17:52:12.652Z',
          lastEdit: '2020-02-14T18:20:07.537Z',
          githubLink: null,
          assigendTo: 'user2',
          title: 'Set Up API',
          creator: 'user1',
          desc: 'Create API for backend and frontend communication so data can be requested from and send to database by client frontend',
        },
        {
          _id: '5e4d992f4281b818a8c2988d',
          projectID: 'firstproject24rrwaefpj',
          issueNumber: 2,
          hourEstimate: 3,
          created: '2020-02-14T17:52:12.652Z',
          lastEdit: '2020-02-14T18:20:07.537Z',
          githubLink: {
            label: '2-loginpage-feat',
            lastCommit: '2020-02-10T20:10:42Z',
            oid: 'c1818eb49ee131f70caec9d90370f7ead9febdb4',
            branchUrl: 'https://github.com/studyTim/test/tree/2-loginpage-feat',
          },
          assigendTo: 'user2',
          title: 'login page',
          creator: 'user1',
          desc: 'Create Login Page for users to enter credentials blajds Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.  ',
        },
        {
          _id: '5e4d99314281b818a8c2988e',
          projectID: 'firstproject24rrwaefpj',
          issueNumber: 3,
          hourEstimate: 3,
          created: '2020-02-14T17:52:12.652Z',
          lastEdit: '2020-02-14T18:20:07.537Z',
          githubLink: {
            label: 'master',
            lastCommit: '28-11-2019 13:30',
            lastCommitFullDate: '2019-11-28T13:30:31.000Z',
            oid: 'fadf5df57f43ace60d15353157531838b45adc9c',
            branchUrl: 'https://github.com/studyTim/QM_Client/tree/master',
          },
          assigendTo: 'user2',
          title: 'Landing page',
          creator: 'user1',
          desc: 'Create landing page for Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. ',
        },
      ],
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
    ...mapState([
      'issueType',
    ]),
    ...mapGetters([
      'getIssues',
    ]),
    listString() {
      return JSON.stringify(this.bklgList, null, 2);
    },
    list2String() {
      return JSON.stringify(this.sprintList, null, 2);
    },
  },
  // async mounted() {
  //   await this.fetchIssues();
  //   this.loaded = true;
  //   // console.log(this.getIssues);
  // },
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
  .issue-card{
    width: 100%;
  }
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
