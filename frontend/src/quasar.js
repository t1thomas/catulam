import Vue from 'vue';

import './styles/quasar.scss';
import iconSet from 'quasar/icon-set/mdi-v4';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import '@quasar/extras/material-icons-round/material-icons-round.css';
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css';
import '@quasar/extras/mdi-v4/mdi-v4.css';
import { Quasar, Dialog } from 'quasar';

Vue.use(Quasar, {
  config: {
    dark: true,
  },
  components: { /* not needed if importStrategy is not 'manual' */ },
  directives: { /* not needed if importStrategy is not 'manual' */ },
  plugins: {
    Dialog,
  },
  iconSet,
});
