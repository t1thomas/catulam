<template>
  <div class="text-center">
    <v-snackbar
      v-model="showBar"
      top
      :timeout="2000"
      class="pa-0"
    >
      <v-alert
        v-model="showBar"
        width="100%"
        :type="type"
        class="ma-0"
        dismissible
      >
        {{ message }}
      </v-alert>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      message: (state) => state.snackBar.message,
      show: (state) => state.snackBar.show,
      type: (state) => state.snackBar.type,
    }),
    showBar: {
      get() {
        return this.show;
      },
      set(val) {
        if (val === false) {
          this.closeSnackBar();
        }
      },
    },
  },
  methods: {
    closeSnackBar() {
      this.$store.dispatch('snackBarOff');
    },
  },
};
</script>

<style scoped>

</style>
