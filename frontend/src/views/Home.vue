<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col class="shrink">
        <v-img
          alt="Caṭulam logo"
          src="../assets/logo.png"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  props: {
    source: String,
  },
};
</script>
