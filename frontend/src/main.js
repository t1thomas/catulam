import Vue from 'vue';
import dotenv from 'dotenv';

import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import '@babel/polyfill';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import { createProvider } from './vue-apollo';

dotenv.config();

Vue.config.productionTip = false;
Vue.$store = store;
Vue.$router = router;


new Vue({
  router,
  store,
  vuetify,
  apolloProvider: createProvider(),
  render: (h) => h(App),
}).$mount('#app');
