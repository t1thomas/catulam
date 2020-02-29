<template>
  <q-scroll-area
    class="rounded-borders"
  >
    <div
      v-for="(sprint, index) in sprintList"
      :key="index"
    >
      <span>
        Sprint {{ index }}
        issues: {{ sprint.length }}
      </span>
      <draggable
        v-model="sprintList[index]"
        tag="div"
        v-bind="dragOptions"
        class="rounded-borders q-list q-list--bordered"
        style="background: cadetblue; min-height: 9vh"
      >
        <q-item
          v-for="issue in sprintList[index]"
          :key="issue._id"
          v-ripple
          clickable
        >
          <ticketCard :ticket="issue" />
        </q-item>
      </draggable>
    </div>
  </q-scroll-area>
</template>

<script>
import draggable from 'vuedraggable';
import backlogTicketQcard from '../backlogTicketQcard.vue';

export default {
  name: 'SprintListColumn',
  components: {
    draggable,
    // sortableList,
    ticketCard: backlogTicketQcard,
  },
  data() {
    return {
      sprintList: [[
        {
          _id: '34trfwaergaerger',
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
          _id: 'wsetaergaergrghsrth',
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
          _id: 'w35wgeaergaergfghsth',
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
      ], [
        {
          _id: 'w435aegaergarthsrt',
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
          _id: 'dsaergaergswraef',
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
      ], [{
        _id: '5e4d9823645yrthsdfg',
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

      ],
      [
        {
          _id: '34trfwe45yhsrter',
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
          _id: 'wset35ywteghsth',
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
          _id: 'w35wgegw435ywtgsghsth',
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
      [
        {
          _id: '34tw45hgrtghsdghfger',
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
          _id: 'wsetgw35yrtgsdrth',
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
          _id: 'w35wgegsrthgdrfghsth',
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
  },
};
</script>

<style scoped>
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
</style>
