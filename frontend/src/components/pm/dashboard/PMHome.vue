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
          color="warning"
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
    <n-pro-dialog />
  </v-container>
</template>

<script>
import NProDialog from './dialogs/NProDialog.vue';
import ProjectList from './MyProjectsComponent/MyProject.vue';

export default {
  name: 'Home',
  components: {
    NProDialog,
    ProjectList,
  },
  methods: {
    print() {

    },
  },
};
</script>
