<template>
  <div class="text-center">
    <v-snackbar
      v-model="show"
      top
      class="pa-0"
    >
      <v-alert
        :type="type"
        class="ma-0"
      >
        {{ message }}
        <v-btn
          color="pink"
          icon
          small
          @click="closeSnackBar"
        >
          <v-icon color="white">
            mdi-close-circle
          </v-icon>
        </v-btn>
      </v-alert>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState({
      message: (state) => state.snackBar.message,
      show: (state) => state.snackBar.show,
      type: (state) => state.snackBar.type,
    }),
  },
  watch: {
    show() {
      if (this.show) {
        setTimeout(this.closeSnackBar, 2000);
      }
    },
  },
  methods: {
    ...mapActions([
      'snackBarOff',
    ]),
    closeSnackBar() {
      this.snackBarOff();
    },
  },
};
</script>

<style scoped>

</style>
