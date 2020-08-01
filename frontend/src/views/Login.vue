<template>
  <v-container
    fluid
    class="fill-height"
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <v-card class="elevation-12">
          <v-toolbar
            color="primary"
            dark
            flat
          >
            <v-toolbar-title>Login form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <form>
              <v-text-field
                v-model.trim.lazy="username"
                :error-messages="userErrors"
                required
                label="Login"
                name="login"
                prepend-icon="mdi-account"
                type="text"
                hint="email address or username"
                @input="$v.username.$touch()"
                @blur="$v.username.$touch()"
              />

              <v-text-field
                v-model.trim.lazy="password"
                :error-messages="passErrors"
                required
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
              />
            </form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              @click="onSubmit"
            >
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { onLogin } from '../vue-apollo';
import gqlQueries from '../graphql/gql-queries';

export default {
  name: 'Login',
  mixins: [validationMixin],
  validations: {
    username: { required },
    password: { required },
  },
  data: () => ({
    valid: true,
    username: null,
    password: null,
  }),
  computed: {
    userErrors() {
      const errors = [];
      // if (!this.$v.username.$dirty) return errors;
      if (!this.$v.username.required) {
        errors.push('Enter Username');
        return errors;
      }
      return errors;
    },
    passErrors() {
      const errors = [];
      if (!this.$v.password.required) {
        errors.push('Enter Password');
        return errors;
      }
      return errors;
    },
    ...mapGetters([
      'getCurrentUser',
    ]),
  },
  watch: {
    getCurrentUser(value) {
      if (value !== null) {
        this.$router.push('/home');
      }
    },
  },
  methods: {
    ...mapActions([
      'snackBarOn',
    ]),
    async onSubmit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        // await this.$store.dispatch('loginUser',
        // { username: this.username, password: this.password });
        await this.$apollo.mutate({
          mutation: gqlQueries.SignInUser,
          fetchPolicy: 'no-cache',
          variables: { username: this.username, password: this.password },
        }).then((response) => {
          const { loginUser } = response.data;
          onLogin(this.$apollo.provider.defaultClient, loginUser.token);
          this.$router.go();
        }).catch((error) => {
          this.$store.dispatch('snackBarOn', {
            message: error,
            type: 'error',
          });
        });
      }
    },
  },
};
</script>

<style scoped>

</style>
