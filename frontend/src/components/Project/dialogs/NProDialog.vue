<template>
  <v-dialog
    v-model="show"
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Create New Project</span>
      </v-card-title>
      <v-card-text>
        <v-form
          v-if="allUsers"
          ref="proForm"
          v-model="valid"
          :lazy-validation="false"
        >
          <v-overlay
            absolute
            :value="saving"
          >
            <v-progress-circular
              :size="150"
              color="primary"
              indeterminate
            />
          </v-overlay>
          <v-row>
            <v-col cols="8">
              <v-text-field
                v-model="title"
                filled
                label="Project Title*"
                :rules="[titleError]"
                required
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="label"
                filled
                label="Project Label*"
                :rules="[labelError]"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="desc"
                no-resize
                filled
                outlined
                label="Description"
              />
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="selected"
                :disabled="saving"
                :items="getMembers()"
                filled
                chips
                label="Select Members"
                multiple
                item-text="fullName"
                item-value="id"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    @click:close="remove(data.item)"
                  >
                    <v-avatar left>
                      <v-img :src="gravatar(data.item)" />
                    </v-avatar>
                    {{ data.item.fullName }}
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  <v-list-item-avatar>
                    <img :src="gravatar(data.item)">
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ data.item.fullName }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col
              cols="12"
              lg="6"
            >
              <v-menu
                ref="menu1"
                v-model="dateMenu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="startDate"
                    readonly
                    label="Start Date*"
                    hint="MM/DD/YYYY format"
                    persistent-hint
                    :rules="[dateMenuError]"
                    prepend-icon="mdi-calendar-today"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="startDate"
                  no-title
                  :show-current="false"
                  @input="dateMenu1 = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              lg="6"
            >
              <v-menu
                v-model="dateMenu2"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="endDate"
                    readonly
                    label="End Date*"
                    hint="MM/DD/YYYY format"
                    persistent-hint
                    :rules="[dateMenuError]"
                    prepend-icon="mdi-calendar-check"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="endDate"
                  no-title
                  :show-current="false"
                  @input="dateMenu2 = false"
                />
              </v-menu>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <small>*indicates required field</small>
        <v-spacer />
        <v-btn
          color="primary darken-1"
          text
          @click="onCancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="onCreate"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import gqlQueries from '@/graphql/gql-queries';
import moment from 'moment';

export default {
  name: 'NProDialog',
  data: () => ({
    desc: '',
    title: '',
    label: '',
    saving: false,
    startDate: '',
    endDate: '',
    valid: true,
    selected: [],
    dateMenu1: '',
    dateMenu2: '',
  }),
  computed: {
    currentDate() {
      return moment().format('YYYY-MM-DD');
    },
    ...mapState({
      currUser: (state) => state.currentUser,
      showDialog: (state) => state.nProDialog.show,
      allUsers: (state) => state.allUserList,
    }),
    show: {
      get() {
        return this.showDialog;
      },
      set(val) {
        this.nProDialogShow({ show: val });
        if (val === false) {
          this.$refs.proForm.reset();
        }
      },
    },
    selectedProvided() {
      return this.selected.length > 0;
    },
  },
  methods: {
    ...mapActions([
      'nProDialogShow',
    ]),
    getMembers() {
      // get all members apart from current User
      return this.$store.getters.getUserSelection(this.currUser.id);
    },
    gravatar(user) {
      return `https://gravatar.com/avatar/${user.avatar}?d=identicon`;
    },
    onCancel() {
      this.nProDialogShow({ show: false });
      this.$refs.proForm.reset();
    },
    async onCreate() {
      if (this.$refs.proForm.validate()) {
        this.setSaving();
        await this.$apollo.mutate({
          mutation: gqlQueries.CREATE_PROJECT,
          fetchPolicy: 'no-cache',
          variables: {
            title: this.title,
            label: this.label,
            startDate: this.startDate,
            endDate: this.endDate,
            desc: this.desc,
            members: this.getSelectedMembers(),
          },
        }).then((response) => {
          const { CreateProject } = response.data;
          this.setSaving();
          this.onCancel();
          this.$store.dispatch('newProject', CreateProject);
          this.selector = false;
        }).catch((error) => {
          this.setSaving();
          this.onCancel();
          this.$store.dispatch('snackBarOn', {
            message: `Unable to Create Project ${error}`,
            type: 'error',
          });
        });
      }
    },
    getSelectedMembers() {
      const arr = [];
      /* first add pm id to list, as his/her own name won't
        show up in selection field */
      arr.push({ id: this.currUser.id });
      /* if additional members have been chosen
       add those in the _UserInput format */
      if (this.selectedProvided) {
        this.selected.forEach((member) => {
          arr.push({ id: member });
        });
      }
      return arr;
    },
    dateMenuError(val) {
      if (!val > 0) {
        return 'Field is Required';
      }
      if (new Date(this.currentDate) > new Date(val)) {
        return 'Date cannot be in the past!';
      }
      if (new Date(this.startDate) > new Date(this.endDate)) {
        return 'End Date must be greater than Start Date!';
      }
      return true;
    },
    titleError(val) {
      if (!val > 0) {
        return 'Field is Required';
      }
      return true;
    },
    setSaving() {
      this.saving = !this.saving;
    },
    labelError(val) {
      if (!val > 0) {
        return 'Field is Required';
      }
      if (val.length > 5) {
        return 'Max Length 5';
      }
      return true;
    },
    remove(user) {
      const index = this.selected.indexOf(user.id);
      if (index >= 0) this.selected.splice(user.id, 1);
    },
  },
};
</script>

<style scoped>

</style>
