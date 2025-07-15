import { createApp }from 'vue';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import resource from "./shared/resource";
import "./tailwind.css";
import dropdown from "./components/ui/DropDown";
import autocomplete from "./components/ui/AutoComplete";
import tooltip from "./components/ui/ToolTip";
import axios from 'axios';


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

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = token;
}

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
