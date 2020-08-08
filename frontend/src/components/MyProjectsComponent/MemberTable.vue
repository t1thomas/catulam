<template>
  <v-card flat>
    <not-found-card
      v-if="getProjectMembers(projectId).length <= 0"
      type="Member"
    />
    <v-simple-table v-else>
      <template v-slot:default>
        <thead>
          <tr>
            <th>
              Member
            </th>
            <th>
              To do (Tickets)
            </th>
            <th>
              Done (Tickets)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="member in getProjectMembers(projectId)"
            :key="member.id"
          >
            <td>
              <v-chip
                pill
              >
                <v-avatar left>
                  <v-img
                    :src="getGravatar(member.id)"
                  />
                </v-avatar>
                {{ getFullName(member.id) }}
                <v-chip
                  v-if="member.role === 'pm'"
                  class="ml-2"
                  x-small
                  color="orange"
                  text-color="white"
                >
                  PM
                  <v-icon
                    right
                    x-small
                  >
                    mdi-crown
                  </v-icon>
                </v-chip>
              </v-chip>
            </td>
            <td>
              {{ getUnDoneTicksByProMember(member.id, projectId).length }}
            </td>
            <td>
              {{ getDoneTicksByProMember(member.id, projectId).length }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import NotFoundCard from '../NotFoundCard.vue';

export default {
  name: 'MemberTable',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    NotFoundCard,
  },
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      'getGravatar',
      'getProjectMembers',
      'getFullName',
      'getDoneTicksByProMember',
      'getUnDoneTicksByProMember',
    ]),
  },
  methods: {
    gravatar(avatar) {
      return `https://gravatar.com/avatar/${avatar}?d=identicon`;
    },
  },
};
</script>

<style scoped>

</style>
