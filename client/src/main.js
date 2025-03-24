import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import dotenv from  'dotenv'
import resource from "./shared/resource";
import "./tailwind.css";
import dayjs from "dayjs";
import dropdown from "./components/ui/DropDown";
import autocomplete from "./components/ui/AutoComplete";
import tooltip from "./components/ui/ToolTip";

console.log(process.env);
// dotenv.config({path : '/home/aditi/Projects/PaperTrade/client/.env'});

const apiUrl = process.env;
console.log('Main process.env:', apiUrl);


// import envPaths from 'env-paths';
// var paths = envPaths('MyApp');
// console.log('paths.data:', paths.data);
// console.log('paths.config:', paths.config);



Vue.component("autocomplete", autocomplete);
Vue.component("dropdown", dropdown);
Vue.component("tooltip", tooltip);

Vue.filter("formatDateTime", function (value) {
  if (value) {
    var _format = value.length <= 10 ? "DD-MMM-YYYY" : "DD-MMM-YYYY HH:mm";
    return dayjs(value, ["YYYY", "YYYY-MM-DD"], "in", true).format(_format);
  }
});
Vue.filter("formatDate", function (value) {
  if (value) {
    console.log('input value :>> ', value);
    var result = dayjs(value, ["YYYY", "YYYY-MM-DD"], "in", true).format("DD-MMM-YYYY");
    console.log('result value :>> ', result);
    return result;
  }
});
Vue.filter("decimal2", function (value) {
  if (value) {
    return parseFloat(value).toFixed(2);
  }
});

Vue.config.productionTip = false;
Vue.config.keyCodes = {
  f2: 113,
};

Vue.use(resource);


new Vue({
  router,
  store,

  render: (h) => h(App),
}).$mount("#app");
