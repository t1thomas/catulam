<template>
  <v-container fluid>
    <v-textarea
      v-model="text"
      height="15vh"
      dense
      :loading="saving"
      no-resize
      filled
      label="Description"
      :disabled="disabled"
      hide-details
      @blur="onBlur"
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
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'DescSection',
  data: () => ({
    text: null,
    disabled: true,
    saving: false,
  }),
  computed: {
    ...mapGetters({
      ticket: 'getCurrTick',
    }),
    desc() {
      return this.ticket.desc;
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
    setOriginalText() {
      this.text = this.desc;
    },
    onBlur() {
      if (this.checkInputSame) {
        this.disabled = true;
      }
    },
    async onSave() {
      this.setSaving();
      this.disabled = true;

      const payload = { tick: { id: this.ticket.id }, desc: this.text };
      await this.$store.dispatch('updateTicketDesc', payload).then(() => {
        this.setSaving();
        this.selector = false;
      }).catch(() => {
        this.setSaving();
        this.disabled = false;
      });
    },
    setSaving() {
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
