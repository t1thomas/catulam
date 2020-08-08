<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        md="6"
      >
        <div
          class="px-5 py-3"
        >
          <v-btn
            class="primary"
            @click="print"
          >
            Print
          </v-btn>
        </div>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <project-list />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import ProjectList from '@/components/MyProjectsComponent/MyProject.vue';

export default {
  name: 'DevHome',
  components: {
    ProjectList,
  },
  computed: {
    ...mapState([
      'projects',
    ]),
  },
  methods: {
    async print() {
      console.log(this.projects);
      console.log(this.$store.state.currentUser);
    },
  },
};
</script>
