import Vue from 'vue';
import App from './App.vue';
import CompositionApi from '@vue/composition-api';
import './registerServiceWorker';
import './assets/css/tailwind.css';

Vue.config.productionTip = false;

Vue.use(CompositionApi);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
