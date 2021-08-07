import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import resource from './shared/resource';
import './index.css';
import dayjs from 'dayjs'


Vue.config.productionTip = false;
Vue.config.globalProperties.$dayjs = dayjs;
Vue.use(resource);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
