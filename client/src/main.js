import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import resource from './shared/resource';
import './tailwind.css';
import dayjs from 'dayjs';
import DropDown from "./components/ui/DropDown";
import tooltip from "./components/ui/ToolTip"


Vue.component("DropDown", DropDown);
Vue.component("tooltip", tooltip);
Vue.filter('formatDate', function (value) {
    if (value) {
       return dayjs(value, ["YYYY", "YYYY-MM-DD"], 'in', true).format('DD-MMM-YYYY hh:mm A');
    }
});



Vue.config.productionTip = false;
Vue.config.keyCodes = {
  f2: 113
};

Vue.use(resource);


new Vue({
  router,
  store,

  render: h => h(App)
}).$mount('#app');
