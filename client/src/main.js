import { createApp }from 'vue';
// import { createApp } from 'vue'
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import dotenv from  'dotenv'
import resource from "./shared/resource";
import "./tailwind.css";
//import dayjs from "dayjs";
import dropdown from "./components/ui/DropDown";
import autocomplete from "./components/ui/AutoComplete";
import tooltip from "./components/ui/ToolTip";


// Vue.filter("formatDateTime", function (value) {
//   if (value) {
//     var _format = value.length <= 10 ? "DD-MMM-YYYY" : "DD-MMM-YYYY HH:mm";
//     return dayjs(value, ["YYYY", "YYYY-MM-DD"], "in", true).format(_format);
//   }
// });
// Vue.filter("formatDate", function (value) {
//   if (value) {
//     console.log('input value :>> ', value);
//     var result = dayjs(value, ["YYYY", "YYYY-MM-DD"], "in", true).format("DD-MMM-YYYY");
//     console.log('result value :>> ', result);
//     return result;
//   }
// });
// Vue.filter("decimal2", function (value) {
//   if (value) {
//     return parseFloat(value).toFixed(2);
//   }
// });

const app = createApp(App);
app.config.productionTip = false;
app.config.keyCodes = {
  f2: 113,
};


app.use(router);
app.use(store);
app.provide('GETCONST',resource);
app.component("autocomplete", autocomplete);
app.component("dropdown", dropdown);
app.component("tooltip", tooltip);

app.mount('#app');


//
//new Vue({
  //  router,
  //  store,
  //
  //  render: (h) => h(App),
  //}).$mount("#app");
