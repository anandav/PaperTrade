import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import resource from "./shared/resource";
import "./tailwind.css";
import dayjs from "dayjs";
import dropdown from "./components/ui/DropDown";
import autocomplete from "./components/ui/AutoComplete";
import tooltip from "./components/ui/ToolTip";

Vue.component("autocomplete", autocomplete);
Vue.component("dropdown", dropdown);
Vue.component("tooltip", tooltip);

Vue.filter("formatDateTime", function (value) {
  if (value) {
    return dayjs(value, ["YYYY", "YYYY-MM-DD"], "in", true).format(
      "DD-MMM-YYYY HH:mm"
    );
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
