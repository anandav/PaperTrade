import { createStore} from "vuex";
import portfolioModule from './modules/portfolio';
import strategyModule from "./modules/strategy";
import tradeModule from './modules/trade';
import dataModule from './modules/data';
import authModule from './modules/auth';


const modules = { portfolioModule, strategyModule, tradeModule, dataModule, authModule };

export default new createStore({
  modules,
});
