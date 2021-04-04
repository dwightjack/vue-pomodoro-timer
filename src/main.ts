import { createApp } from 'vue';
import App from './App.vue';
import { install } from './registerServiceWorker';
import './assets/css/tailwind.css';

const { worker } = install();

createApp(App).provide('worker', worker).mount('#app');
