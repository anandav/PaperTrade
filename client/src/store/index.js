import Vuex from "vuex";
import Vue from "vue";
import portfolioModule from './modules/portfolio';
import strategyModule from "./modules/strategy";
import  tradeModule from './modules/trade';
 
Vue.use(Vuex);

const modules = { portfolioModule, strategyModule, tradeModule  };

export default new Vuex.Store({
  modules,
});
