import moment from 'moment';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import apolloProvider from './plugins/apolloClient';
import vuetify from './plugins/vuetify';
import '@babel/polyfill';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';


Vue.$moment = moment;
Vue.config.productionTip = false;
Vue.$store = store;


new Vue({
  router,
  store,
  apolloProvider,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
