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
        <q-input
          ref="pass"
          v-model="password"
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

export default {
  name: 'PassReset',
  data() {
    return {
      confirmPass: '',
      password: '',
      passError: '',
      conPassError: '',
      isPwd: true,
    };
  },
  computed: {
    passMatch() {
      return this.confirmPass === this.password;
    },
  },
  methods: {
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
    onSubmit() {
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
