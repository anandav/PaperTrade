import { createApp } from 'vue';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import setupAxiosInterceptors from './shared/axios-interceptor';
import resource from "./shared/resource";
import "./tailwind.css";
import dropdown from "./components/ui/DropDown";
import autocomplete from "./components/ui/AutoComplete";
import tooltip from "./components/ui/ToolTip";
import axios from 'axios';
import formatters from './common/formatters';

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const app = createApp(App);
app.config.productionTip = false;
app.config.keyCodes = {
  f2: 113,
};

app.config.globalProperties.$filters = formatters;

app.use(router);
app.use(store);
setupAxiosInterceptors(store);
app.provide('GETCONST',resource);
app.component("autocomplete", autocomplete);
app.component("dropdown", dropdown);
app.component("tooltip", tooltip);

app.mount('#app');
