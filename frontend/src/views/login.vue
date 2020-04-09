<template>
  <q-page class="flex flex-center">
    <div
      class="q-pa-md log-form"
    >
      <q-form
        class="q-gutter-md"
        @submit="onSubmit"
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
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Vue from 'vue';
import gqlQueries from '../graphql/gql-queries';

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
    // currentUser() {
    //   if (this.currentUser) {
    //     this.$router.push('/home');
    //   }
    // },
  },
  async mounted() {
    // await this.fetchCurrentUser();
  },
  methods: {
    ...mapActions([
      'fetchCurrentUser',
    ]),
    async onSubmit() {
      await this.loginUser();
      // await this.fetchCurrentUser();
    },
    async loginUser() {
      localStorage.setItem('catulam_token', '');
      await Vue.$apolloClient.mutate({
        mutation: gqlQueries.SignInUser,
        fetchPolicy: 'no-cache',
        variables: { username: this.username, password: this.password },
      }).then((response) => {
        console.log(response.data);
        const { loginUser } = response.data;
        localStorage.setItem('catulam_token', loginUser.token);
      }).catch((error) => {
        console.error(error);
      });
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
