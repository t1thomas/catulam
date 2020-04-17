<template>
  <v-row>
    <v-col
      cols="4"
    >
      <span class="headline">
        {{ title }} # {{ issueNo }}
      </span>
    </v-col>
    <v-divider
      style="background: lightslategrey"
      vertical
    />
    <v-col
      cols="7"
    >
      <span class="body-2">
        Assigned to:
      </span>

      <v-avatar
        size="24"
        class="ml-2"
      >
        <img
          src="@/assets/avatar/scientist.svg"
          alt="John"
        >
      </v-avatar>
      User Name
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TopSection',
  props: {
    title: {
      type: String,
      required: true,
    },
    issueNo: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>

</style>
