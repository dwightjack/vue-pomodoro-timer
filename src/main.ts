import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/css/tailwind.css';
import { persistPlugin } from './stores/plugins/persist';

const pinia = createPinia();

pinia.use(persistPlugin);

createApp(App).use(pinia).mount('#app');
