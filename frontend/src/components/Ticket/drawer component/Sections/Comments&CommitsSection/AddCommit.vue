<template>
  <v-container>
    <v-card flat>
      <v-card-text class="py-0">
        <v-row>
          <v-col
            class="px-0"
            cols="8"
          >
            <v-textarea
              v-model="message"
              dense
              height="13vh"
              filled
              label="Commit Message"
              hide-details
              no-resize
            />
          </v-col>
          <v-col cols="4">
            <v-col
              class="px-0"
              cols="12"
            >
              Update Time Est:
            </v-col>
            <v-col
              cols="12"
              class="pa-0"
            >
              <v-text-field
                v-model="hours"
                filled
                type="Number"
                suffix="hrs"
                outlined
                style="width: 125px;margin-left: auto"
                hide-details
                :value="hours"
              />
            </v-col>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pt-0 pb-1">
        <v-spacer />
        <v-btn
          small
          color="primary darken-1"
          text
          @click="showAddCommitOverLay(false)"
        >
          Cancel
        </v-btn>
        <v-btn
          small
          color="primary"
          @click="pushCommit"
        >
          <v-icon
            right
            dark
          >
            mdi-upload-outline
          </v-icon>
          Push Commit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import gqlQueries from '@/graphql/gql-queries';

export default {
  name: 'AddCommit',
  data: () => ({
    hours: 0,
    message: '',
  }),
  computed: {
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
    ...mapState({
      show: (state) => state.addCommitOverLay,
    }),
    validInput() {
      const pattern = /^[1-9]\d*$/;
      return pattern.test(this.hours);
    },
  },
  mounted() {
    this.setOriginalHours();
  },
  methods: {
    ...mapActions([
      'showAddCommitOverLay',
    ]),
    setOriginalHours() {
      this.hours = this.ticket.hourEstimate;
    },
    async pushCommit() {
      if (this.validInput) {
        await this.$apollo.mutate({
          mutation: gqlQueries.ADD_TICKET_COMMIT,
          fetchPolicy: 'no-cache',
          variables: {
            tick: { id: this.ticket.id },
            commit: {
              message: this.message,
              newEst: Number(this.hours),
            },
          },
        }).then(() => {
          this.$store.dispatch('showAddCommitOverLay', false);
        }).catch((error) => {
          this.$store.dispatch('showAddCommitOverLay', false);
          this.$store.dispatch('snackBarOn', {
            message: `Unable to Add Commit ${error}`,
            type: 'error',
          });
        });
      } else {
        await this.$store.dispatch('snackBarOn', {
          message: 'Enter valid number greater than 0',
          type: 'warning',
        });
      }
    },
  },
};
</script>

<style scoped>

</style>
