<template>
  <v-card>
    <v-tabs
      v-if="currProject"
      vertical
      color="orange"
    >
      <v-tab>
        <v-icon left>
          mdi-account
        </v-icon>
        Members
        <v-badge
          inline
          :content="currProject.members.length"
        />
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-lock
        </v-icon>
        Option 2
      </v-tab>

      <v-tab-item>
        <v-btn
          class="primary"
          @click="print"
        >
          Print
        </v-btn>
        <v-card flat>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>
                    Member
                  </th>
                  <th>
                    To do
                  </th>
                  <th>
                    Done
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="member in proMembers()"
                  :key="member.id"
                >
                  <td>
                    <v-chip
                      pill
                    >
                      <v-avatar left>
                        <v-img
                          :src="gravatar(member)"
                        />
                      </v-avatar>
                      {{ member.fullName }}
                    </v-chip>
                  </td>
                  <td>
                    {{ doneTicksCount(member) }}
                  </td>
                  <td>
                    {{ unCompleteTicksCount(member) }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <p class="mb-0">
              hi
            </p>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ProDetailsTabs',
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      projects: (state) => state.currPmProjects,
      allUsers: (state) => state.allUserList,
    }),
    currProject() {
      if (this.projects === null || this.allUsers === null) {
        return null;
      }
      return this.projects.find((project) => project.id === this.projectId);
    },
  },
  methods: {
    gravatar(member) {
      return `https://gravatar.com/avatar/${member.avatar}?d=identicon`;
    },
    print() {
      console.log(this.proMembers());
    },
    proMembers() {
      // get all the member ids from state.currPmProjects
      const userIds = this.currProject.members.map((member) => member.User.id);
      // filter the allUsers to get members full details
      return this.allUsers.filter((member) => userIds.includes(member.id));
    },
    doneTicksCount(member) {
      let count = 0;
      member.tickets.forEach((tick) => {
        if (tick.done) {
          count += 1;
        }
      });
      return count;
    },
    unCompleteTicksCount(member) {
      let count = 0;
      member.tickets.forEach((tick) => {
        if (!tick.done) {
          count += 1;
        }
      });
      return count;
    },
  },
};
</script>
<style scoped>

</style>
