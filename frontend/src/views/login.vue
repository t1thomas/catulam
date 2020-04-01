<template>
  <q-page class="flex flex-center">
    <div
      class="q-pa-md log-form"
    >
      <q-form
        class="q-gutter-md"
        @submit="onSubmit"
        @reset="onRegister"
      >
        <q-input
          v-model="username"
          filled
          label="Username *"
          hint="email address or username"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Enter Username']"
        />

        <q-input
          v-model="password"
          filled
          :type="isPwd ? 'password' : 'text'"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Enter Password']"
          hint="Password with toggle"
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
            label="Login"
            type="submit"
            color="primary"
          />
          <q-btn
            label="Register"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      isPwd: true,
    };
  },
  computed: {
    ...mapState([
      'currentUser',
    ]),
  },
  watch: {
    currentUser() {
      if (this.currentUser) {
        this.$router.push('/backlog');
      }
    },
  },
  methods: {
    ...mapActions([
      'loginUser',
    ]),
    onSubmit() {
      this.loginUser({ username: this.username, password: this.password });
    },
    onRegister() {
      console.log('Register page');
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
