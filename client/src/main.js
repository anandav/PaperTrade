import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import resource from './shared/resource';

// var dayjs = require('dayjs');
// dayjs().format();
// Vue.config.globalProperties.$dayjs = dayjs;

Vue.config.productionTip = false;
Vue.use(resource);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
