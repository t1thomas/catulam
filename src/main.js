import Vue from 'vue';
import VueApollo from 'vue-apollo';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/axios';
import './quasar';

import apolloClient from './apolloClient';

Vue.$apolloClient = apolloClient;


const apolloProvider = new VueApollo({ apolloClient });
Vue.use(VueApollo);
new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App),
}).$mount('#app');
