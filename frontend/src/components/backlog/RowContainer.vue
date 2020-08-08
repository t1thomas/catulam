<template>
  <v-content>
    <v-card color="#5c535366">
      <v-card-title
        class="pa-0"
      >
        <toolbar />
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-2">
        <u-story-rows />
      </v-card-text>
    </v-card>
  </v-content>
</template>
<script>
import UStoryRows from '@/components/backlog/UStoryRows.vue';
import toolbar from './toolbar.vue';

export default {
  name: 'RowContainer',
  components: {
    UStoryRows,
    toolbar,
  },
  computed: {
    proId() {
      return this.$route.query.proId;
    },
  },
};
</script>

<style scoped>

</style>
