import Vue from 'vue';
import VueApollo from 'vue-apollo';
import App from './App.vue';
import router from './router';
import store from './store';
import './quasar';

import apolloClient from './plugins/apolloClient';

Vue.$apolloClient = apolloClient;

const apolloProvider = new VueApollo({ apolloClient });
Vue.use(VueApollo);
new Vue({
  router,
  store,
  apolloProvider,
  created() {
    this.$store.dispatch('fetchCurrentUser');
  },
  render: (h) => h(App),
}).$mount('#app');
