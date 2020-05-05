<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Create New Project</span>
        </v-card-title>
        <v-card-text>
          <v-form
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
                    @input="dateMenu2 = false"
                  />
                </v-menu>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <small>*indicates required field</small>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
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
  </v-row>
</template>

<script>
export default {
  name: 'NSprintDialog',
  data: () => ({
    desc: '',
    title: '',
    label: '',
    saving: false,
    startDate: '',
    endDate: '',
    hours: 0,
    valid: true,
    selected: [],
    dateMenu1: false,
    dateMenu2: false,
    currentDate: new Date().toISOString().substr(0, 10),
  }),
};
</script>

<style scoped>

</style>
