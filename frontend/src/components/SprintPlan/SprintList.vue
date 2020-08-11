<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title class="body-1">
        Sprints ({{ sprints.length }})
      </v-toolbar-title>
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            color="#4d371a"
            x-small
            v-on="on"
            @click="nSprintDialog(true)"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span class="caption">Add new Sprint</span>
      </v-tooltip>
    </v-toolbar>
    <v-list
      style="background: rgb(39, 54, 102); width: 100%; min-height: 89vh; max-height: 89vh;
       overflow-y: auto; overflow-x: hidden;"
    >
      <v-list-item
        v-for="sprint in sprints"
        :key="sprint.id"
      >
        <sprint-item :sprint="sprint" />
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import SprintItem from '@/components/SprintPlan/SprintItem.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SprintList',
  components: {
    SprintItem,
  },
  computed: {
    proId() {
      return this.$route.query.proId;
    },
    currPro() {
      return this.getProject(this.proId);
    },
    ...mapGetters([
      'getProject',
      'getProjectSprints',
    ]),
    sprints() {
      const sprints = this.getProjectSprints(this.proId);
      return sprints.sort((a, b) => a.sprintNo - b.sprintNo);
    },
  },
  methods: {
    ...mapActions([
      'nSprintDialog',
    ]),
  },
};
</script>

<style scoped>

</style>
