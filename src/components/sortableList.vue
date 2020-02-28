<template>
  <q-list
    bordered
    class="rounded-borders"
    style="height: 100%; min-width: 600px"
  >
    <q-item
      v-for="issue in bklgList"
      :key="issue._id"
      class="issue-items"
      clickable
    >
      <q-card
        style="width: 100%"
      >
        <q-card-section horizontal>
          <span class="text-weight-medium">{{ issue.issueNumber }}</span>
          <span class="text-grey-8"> - {{ issue.title }}</span>
        </q-card-section>
        <q-separator horizontal />
        <q-card-actions align="right">
          <q-btn
            flat
            class="handler"
          >
            Handle
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-item>
  </q-list>
</template>

<script>
/* eslint-disable */
export default {
  name: 'SortableList',
  directives: {
    focus: {
      // directive definition
      inserted(el, binding) {
        new Sortable(el, binding.value);
      },
    },
  },
  data() {
    return {
      defaultOptions : {
        draggable: 'q-item',
        handle: '[q-card]',
        mirror: {
          constrainDimensions: true,
        },
      },
      bklgList: [
        {
          _id: '5e4d982360b45418a87cbaf3',
          projectID: 'firstproject24rrwaefpj',
          issueNumber: 1,
          created: '2020-02-14T17:52:12.652Z',
          lastEdit: '2020-02-14T18:20:07.537Z',
          githubLink: null,
          assigendTo: 'user2',
          title: 'Set Up API',
          creator: 'user1',
          desc: 'Create API for backend and frontend communication',
        },
        {
          _id: '5e4d992f4281b818a8c2988d',
          projectID: 'firstproject24rrwaefpj',
          issueNumber: 2,
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
          desc: 'Create Login Page for users to enter credentials',
        },
        {
          _id: '5e4d99314281b818a8c2988e',
          projectID: 'firstproject24rrwaefpj',
          issueNumber: 3,
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
          desc: 'Create landing page for user',
        },
      ],
    };
  },
  // props: {
  //   value: {
  //     type: Array,
  //     required: true,
  //   },
  // },
  mounted() {
    // const sortable = new Sortable(document.querySelectorAll('[q-list]'), {
    //   draggable: '[q-item]',
    //   handle: '[q-card]',
    //
    // });
    //
    //
    // // const sortable = new Sortable(document.querySelectorAll('q-list'), {
    // //   draggable: 'q-item',
    // //   handle: 'q-btn',
    // //
    // // });

    //
    // // this.$on('sortable:start', () => console.log('sortable:start'));
    // // this.$on('sortable:sort', () => console.log('sortable:sort'));
    // // this.$on('sortable:sorted', () => console.log('sortable:sorted'));
    // // this.$on('sortable:stop', () => console.log('sortable:stop'));
},

};
</script>

<style scoped>

</style>
