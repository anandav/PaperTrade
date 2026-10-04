import { createStore} from "vuex";
import portfolioModule from './modules/portfolio';
import strategyModule from "./modules/strategy";
import tradeModule from './modules/trade';
import dataModule from './modules/data';
import authModule from './modules/auth';
import splitPlanModule from './modules/splitplan';


const modules = { portfolioModule, strategyModule, tradeModule, dataModule, authModule, splitPlanModule };

export default new createStore({
  modules,
});
