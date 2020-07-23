<template>
  <v-row>
    <v-col
      cols="12"
    >
      <v-textarea
        v-if="desc"
        v-model="text"
        height="15vh"
        dense
        :loading="saving"
        no-resize
        filled
        label="Description"
        :disabled="disabled"
        @blur="onBlur"
        hide-details
      >
        <template
          v-if="!saving"
          v-slot:append
          style="display: grid"
        >
          <v-btn
            v-if="editButton"
            color="dark"
            fab
            x-small
            dark
            style="pointer-events: auto"
            @click="disabled = !disabled"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <div
            v-if="!disabled"
            class="edit-btns"
          >
            <v-btn
              ccolor="dark"
              class="mb-2"
              fab
              x-small
              :disabled="!btnUndoSave"
              dark
              style="pointer-events: auto"
              @click="setOriginalText"
            >
              <v-icon>mdi-undo</v-icon>
            </v-btn>
            <v-btn
              color="dark"
              fab
              :disabled="!btnUndoSave"
              x-small
              dark
              style="pointer-events: auto"
              @click="onSave"
            >
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </div>
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
import gqlQueries from '../../../../graphql/gql-queries';

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
      return this.disabled && this.checkInputSame;
    },
    btnUndoSave() {
      return this.text !== this.desc;
    },
    checkInputSame() {
      return this.text === this.desc;
    },
  },
  mounted() {
    this.setOriginalText();
  },
  methods: {
    ...mapActions([
      'setCurrTickDesc',
      'snackBarOn',
    ]),
    setOriginalText() {
      this.text = this.desc;
    },
    onBlur() {
      if (this.checkInputSame) {
        this.disabled = true;
      }
    },
    async onSave() {
      // starts saving animation
      this.savingProgress();
      this.disabled = true;
      await this.$apollo.mutate({
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
          this.snackBarOn({
            message: error,
            type: 'error',
          });
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
.edit-btns {
  display: grid;
}
</style>
