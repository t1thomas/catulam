<template>
  <v-row>
    <v-col>
      <v-textarea
        v-if="desc"
        v-model="text"
        :loading="saving"
        no-resize
        filled
        label="Description"
        :disabled="disabled"
        @blur="onBlur"
      >
        <template
          v-if="!saving"
          v-slot:append
        >
          <v-btn
            v-if="editButton"
            color="primary"
            fab
            x-small
            dark
            style="pointer-events: auto"
            @click="disabled = !disabled"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="btnUndoSave"
            class="mx-2"
            color="primary"
            fab
            x-small
            dark
            style="pointer-events: auto"
            @click="setOriginalText"
          >
            <v-icon>mdi-undo</v-icon>
          </v-btn>
          <v-btn
            v-if="btnUndoSave"
            color="primary"
            fab
            x-small
            dark
            style="pointer-events: auto"
            @click="onSave"
          >
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </template>
        <template
          v-slot:progress
        >
          <v-progress-linear
            :active="saving"
            indeterminate
            bottom
            absolute
            color="amber"
          />
        </template>
      </v-textarea>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Vue from 'vue';
import gqlQueries from '../../../graphql/gql-queries';

export default {
  name: 'DescSection',
  data: () => ({
    text: null,
    disabled: true,
    saving: false,
  }),
  computed: {
    ...mapState({
      ticket: 'currentTicket',
    }),
    desc() {
      const { desc } = this.ticket;
      if (desc !== null) {
        return desc;
      }
      return false;
    },
    editButton() {
      return this.disabled && this.checkInput;
    },
    btnUndoSave() {
      return this.text !== this.desc;
    },
    checkInput() {
      return this.text === this.desc;
    },
  },
  mounted() {
    this.setOriginalText();
  },
  methods: {
    ...mapActions([
      'setCurrTickDesc',
    ]),
    setOriginalText() {
      this.text = this.desc;
    },
    onBlur() {
      if (this.checkInput) {
        this.disabled = true;
      }
    },
    async onSave() {
      // starts saving animation
      this.savingProgress();
      this.disabled = true;
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.UPDATE_TICKET_DESC,
        fetchPolicy: 'no-cache',
        variables: { id: this.ticket.id, desc: this.text },
      })
        .then((response) => {
          const { UpdateTicket } = response.data;
          if (UpdateTicket === null) {
            throw new Error('Unable to save changes');
          } else {
            this.setCurrTickDesc(UpdateTicket.desc);
          }
          // Ends saving animation
          this.savingProgress();
        })
        .catch((error) => {
          this.disabled = false;
          console.error(error);
          this.savingProgress();
        });
    },
    savingProgress() {
      this.saving = !this.saving;
    },
  },
};
</script>

<style scoped>

</style>
