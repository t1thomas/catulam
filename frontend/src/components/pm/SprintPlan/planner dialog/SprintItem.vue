<template>
  <v-list-item-content>
    <v-card :color="sprint.active ? '#2d4a20': 'dark'">
      <v-row>
        <v-col
          cols="auto"
          style="text-align: center;"
        >
          <span class="subtitle-1">
            Sprint {{ sprint.sprintNo }}
          </span>
          <v-list
            dense
            style="background-color: inherit"
          >
            <v-list-item>
              <v-list-item-content>
                <v-chip
                  small
                  style="width: inherit"
                  color="#018a06"
                  label
                  class="mb-2"
                >
                  <v-avatar
                    tile
                    color="#10710e"
                    left
                  >
                    <span>Start</span>
                  </v-avatar>
                  {{ sprint.startDate }}
                </v-chip>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-chip
                  small
                  color="#ab1a2e"
                  style="width: inherit"
                  label
                >
                  <v-avatar
                    tile
                    color="#670d0d"
                    left
                  >
                    End
                  </v-avatar>
                  <span>
                    {{ sprint.endDate }}
                  </span>
                </v-chip>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col
          cols="auto"
          style="text-align: center;"
        >
          <v-card
            flat
            style="background-color: inherit"
          >
            <v-simple-table style="background-color: inherit">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>
                      Days
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
                  <tr>
                    <td>
                      {{ daysBetween.toString() }}
                    </td>
                    <td>
                      {{ unCompleteTickets.toString() }}
                    </td>
                    <td>
                      {{ completeTickets.toString() }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
          <span v-if="sprint.active">
            Active
            <v-badge
              dot
              color="#3aaf25"
              inline
            />
          </span>
          <span v-else>
            In-active
            <v-badge
              dot
              color="#ffae4a"
              inline
            />
          </span>
        </v-col>
      </v-row>
    </v-card>
  </v-list-item-content>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'SprintItem',
  props: {
    sprint: {
      type: Object,
      required: true,
    },
  },
  computed: {
    daysBetween() {
      const start = Vue.$moment(this.sprint.startDate);
      const end = Vue.$moment(this.sprint.endDate);
      return end.diff(start, 'days');
    },
    unCompleteTickets() {
      return this.sprint.tickets.filter((tick) => tick.done === false).length;
    },
    completeTickets() {
      return this.sprint.tickets.filter((tick) => tick.done === true).length;
    },
  },
};
</script>

<style scoped>

</style>
