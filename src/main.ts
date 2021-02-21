import './assets/scss/custom-bulma.scss';
import './assets/scss/custom-fontawesome.scss';
import './assets/scss/layout.scss';
import './assets/scss/transitions.scss';
import 'highlight.js/styles/monokai-sublime.css';
// import 'highlight.js/styles/rainbow.css';
// import 'highlight.js/styles/tomorrow.css';
// import 'highlight.js/styles/github-gist.css';
import '@fortawesome/fontawesome-free/css/all.css';

import {createApp} from 'vue';
import App from './App.vue';
import initGlobalVueConfig from '@/config/initGlobalVueConfig';

initGlobalVueConfig();

const app = createApp(App);

app.mount('#app');
