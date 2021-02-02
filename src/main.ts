import './assets/scss/custom-bulma.scss';
import './assets/scss/layout.scss';
import 'highlight.js/styles/monokai-sublime.css';
// import 'highlight.js/styles/rainbow.css';
// import 'highlight.js/styles/tomorrow.css';
// import 'highlight.js/styles/github-gist.css';
import {createApp} from 'vue';
import App from './App.vue';

const app = createApp(App);

app.mount('#app');