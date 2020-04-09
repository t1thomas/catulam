<template>
  <q-page class="flex flex-center">
    <div
      class="q-pa-md log-form"
    >
      <q-form
        ref="passForm"
        no-error-focus
        greedy
        class="q-gutter-md"
        @submit="onSubmit"
      >
        <div class="text-h6">
          Change Password..
        </div>
        <q-input
          ref="pass"
          v-model="newPassword"
          filled
          :type="isPwd ? 'password' : 'text'"
          :rules="[passwordMessage]"
          @input="validate"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-input
          ref="conPass"
          v-model="confirmPass"
          filled
          lazy-rules
          :type="isPwd ? 'password' : 'text'"
          :rules="[passwordMessage]"
          @input="validate"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <div>
          <q-btn
            label="Change Password"
            type="submit"
            color="primary"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>

import { mapActions, mapState } from 'vuex';

export default {
  name: 'PassReset',
  data() {
    return {
      confirmPass: '',
      newPassword: '',
      passError: '',
      conPassError: '',
      isPwd: true,
    };
  },
  computed: {
    ...mapState([
      'currentUser',
    ]),
    passMatch() {
      return this.confirmPass === this.newPassword;
    },
  },
  watch: {
    currentUser() {
      if (!this.currentUser) {
        this.$router.push('/login');
      }
      if (this.currentUser && this.currentUser.passwordUpdate === false) {
        this.$router.push('/home');
      }
    },
  },
  async mounted() {
    await this.fetchCurrentUser();
  },
  methods: {
    ...mapActions([
      'fetchCurrentUser',
      'resetPass',
    ]),
    passwordMessage(val) {
      if (!val > 0) {
        return 'Field is Required';
      }
      if (!this.passMatch) {
        return 'Passwords don\'t match';
      }
      return true;
    },
    validate() {
      setTimeout(() => {
        this.$refs.pass.validate();
        this.$refs.conPass.validate();
      }, 500);
    },
    async onSubmit() {
      await this.resetPass({ username: this.currentUser.username, newPassword: this.newPassword });
      await this.fetchCurrentUser();
      console.log('Pass change Submit');
    },
  },
};
</script>

<style scoped>
  .log-form {
    max-width: 30%;
    min-width: 30%;
  }
</style>
