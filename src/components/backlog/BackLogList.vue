<template>
  <div class="q-pa-md row items-start q-gutter-sm">
    <q-card
      v-for="(rr,n) in danmList"
      :key="n"
      class="card"
      bordered
    >
      <q-card-section horizontal>
        <q-card-section class="col-3 card-text">
          {{ lorem }}
        </q-card-section>
        <q-separator vertical />
        <draggable
          v-model="danmList[n]"
          tag="div"
          v-bind="dragOptions"
          class="rounded-borders q-list q-list--bordered"
          style="background: cadetblue; width: 100%"
        >
          <q-item
            v-for="issue in rr"
            :key="issue._id"
            v-ripple
            clickable
          >
            <ticketCard :ticket="issue" />
          </q-item>
        </draggable>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import draggable from 'vuedraggable';
import backlogTicketQcard from '../QItemTicketQcard.vue';

export default {
  name: 'BackLogList',
  components: {
    // sortableList,
    draggable,
    ticketCard: backlogTicketQcard,
  },
  data() {
    return {
      lorem: 'As a developer I want to link my ticket to my github branch so I can easily associate my ticket to the code I\'m working on.',
      loaded: false,
      model1: [],
      model2: [],
      danmList: [[{
        _id: '5e4d982360b4segsergaf3',
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
      }], [{
        _id: '5e4d992f4w3tg3werg2988d',
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
      }], [{
        _id: '5e4d993w35gwergsdfg988e',
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
      }], [], []],

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
      return JSON.stringify(this.danmList, null, 2);
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
/*@media (min-width: 1024px) {*/
/*  .card {*/
/*    !* 364px @ 1024px increasing to 454px @ 1880px *!*/
/*    max-width: calc(22.75rem + ((1vw - 10.24px) * 10.514));*/
/*    !* Where: * 10.514 = 100 * Size_Difference / viewport_Width_Difference *!*/
/*   }*/
/*  .card-text {*/
/*    font-size: calc(0.625rem + ((1vw - 10.24px) * 0.1947));*/
/*  }*/
/* }*/
</style>
