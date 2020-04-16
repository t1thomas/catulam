import Vue from 'vue';
import VueApollo from 'vue-apollo';
import App from './App.vue';
import router from './router';
import store from './store';
import apolloClient from './plugins/apolloClient';
import vuetify from './plugins/vuetify';
import '@babel/polyfill';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;
Vue.$store = store;


const apolloProvider = new VueApollo({ apolloClient });
Vue.use(VueApollo);
new Vue({
  router,
  store,
  apolloProvider,

  created() {
    this.$store.dispatch('fetchCurrentUser')
      .catch((e) => {
        console.error(e);
      });
  },

  vuetify,
  render: (h) => h(App),
}).$mount('#app');
