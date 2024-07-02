import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import '@fontsource-variable/inter';
import './assets/css/tailwind.css';

createApp(App).use(createPinia()).mount('#app');
