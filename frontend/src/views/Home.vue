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
        md="6"
      >
        <div
          color="warning"
          class="px-5 py-3"
        >
          WIP
        </div>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-tabs
            v-model="tab"
            background-color="primary"
            dark
          >
            <v-tab
              v-for="item in items"
              :key="item.tab"
            >
              {{ item.tab }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item
              v-for="item in items"
              :key="item.tab"
            >
              <v-card flat>
                <v-card-text>{{ item.content }}</v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data: () => ({
    tab: null,
    items: [
      { tab: 'One', content: 'Tab 1 Content' },
      { tab: 'Two', content: 'Tab 2 Content' },
      { tab: 'Three', content: 'Tab 3 Content' },
    ],
  }),
};
</script>
