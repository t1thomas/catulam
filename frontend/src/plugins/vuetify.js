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
        primary: '#1e1e1e',
        accent: '#424242',
        error: '#FF5252',
        myBlue: '#2196F3',
        myBlue2: '#7ea8c5',
        success: '#4CAF50',
        warning: '#FFC107',
      },
    },
  },
});
