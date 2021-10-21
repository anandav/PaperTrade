import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import resource from './shared/resource';
import dayjs from 'dayjs';
import './tailwind.css';




Vue.filter('formatDate', function (value) {
  if (value) {
    return dayjs(value, ["YYYY", "YYYY-MM-DD"], 'in', true);
    //moment(String(value)).format('MM/DD/YYYY hh:mm')
  }
});


Vue.config.productionTip = false;
Vue.use(resource);

new Vue({
  router,
  store,

  render: h => h(App)
}).$mount('#app');
