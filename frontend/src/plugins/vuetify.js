import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    options: {
      customProperties: true,
    },
    themes: {
      dark: {
        main: '#1e1e1e',
        primary: '#7ea8c5',
        accent: '#424242',
        error: '#FF5252',
        success: '#4CAF50',
        warning: '#FFC107',
      },
    },
  },
});
