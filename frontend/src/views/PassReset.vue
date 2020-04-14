<template>
  <v-container
    class="fill-height"
    fluid
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
            <v-toolbar-title>Reset Password... </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form
              ref="passForm"
              v-model="valid"
              :lazy-validation="lazy"
            >
              <v-text-field
                v-model="password1"
                required
                label="Password"
                name="password1"
                type="password"
                :rules="[passwordMessage]"
                @input="validate"
              />

              <v-text-field
                v-model="password2"
                required
                label="Confirm Password"
                name="password2"
                type="password"
                :rules="[passwordMessage]"
                @input="validate"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              @click="onSubmit"
            >
              Change Password
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'PassReset',
  data: () => ({
    valid: true,
    lazy: false,
    password2: '',
    password1: '',
  }),
  computed: {
    ...mapGetters([
      'getCurrentUser',
    ]),
    ...mapState([
      'currentUser',
    ]),
    passMatch() {
      return this.password2 === this.password1;
    },
  },
  watch: {
    getCurrentUser(value) {
      if (value === null) {
        this.$router.push('/login');
      } else if (value.passwordUpdate === false) {
        this.$router.push('/login');
      }
    },
  },
  mounted() {
    if (this.getCurrentUser === null) {
      this.$router.push('/login');
    } else if (this.getCurrentUser.passwordUpdate === false) {
      this.$router.push('/login');
    }
  },
  methods: {
    ...mapActions([
      'fetchCurrentUser',
      'resetPass',
    ]),
    async validate() {
      // eslint-disable-next-line no-return-await
      return setTimeout(() => this.$refs.passForm.validate(), 500);
    },
    passwordMessage(val) {
      if (!val > 0) {
        return 'Field is Required';
      }
      if (!this.passMatch) {
        return 'Passwords don\'t match';
      }
      return true;
    },
    async onSubmit() {
      if (this.$refs.passForm.validate()) {
        await this.resetPass({ username: this.currentUser.username, newPassword: this.password2 });
        await this.fetchCurrentUser();
        console.log('Pass change Submit');
      }
    },
  },
};
</script>

<style scoped>

</style>
