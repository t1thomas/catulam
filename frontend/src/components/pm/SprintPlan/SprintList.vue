<template>
  <v-card>
    <v-list-item
      style="background-color: #2e2b2b"
    >
      <v-list-item-content>
        <v-list-item-title
          class="subtitle-2"
          style="text-align: center"
        >
          Start Date: {{ currPro.startDate }}
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-icon>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              color="#4d371a"
              x-small
              v-on="on"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span class="caption">Add new Sprint</span>
        </v-tooltip>
      </v-list-item-icon>
    </v-list-item>

    <v-list
      style="background: rgb(39, 54, 102);width: 100%; height: 82%; overflow-y: auto"
    >
      <v-list-item
        v-for="sprint in sprints"
        :key="sprint.id"
      >
        <sprint-item :sprint="sprint" />
      </v-list-item>
    </v-list>
    <v-card-actions
      style="background-color: #2e2b2b"
      class="justify-center"
    >
      <span class="subtitle-2">
        End Date: {{ currPro.endDate }}
      </span>
    </v-card-actions>
  </v-card>
</template>

<script>
import SprintItem from '@/components/pm/SprintPlan/SprintItem.vue';
import { mapGetters } from 'vuex';

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
};
</script>

<style scoped>

</style>
