import '@/assets/scss/custom-bulma.scss';
import '@/assets/scss/custom-fontawesome.scss';
import '@/assets/scss/layout.scss';
import '@/assets/scss/transitions.scss';
import '@/assets/scss/prefixed-prism-tomorrow.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { createApp } from 'vue';
import App from './App.vue';
import initGlobalVueConfig from '@/config/initGlobalVueConfig';

initGlobalVueConfig();

createApp(App).mount('#app');
