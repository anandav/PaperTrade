import { createStore} from "vuex";
import portfolioModule from './modules/portfolio';
import strategyModule from "./modules/strategy";
import tradeModule from './modules/trade';
import dataModule from './modules/data';


const modules = { portfolioModule, strategyModule, tradeModule, dataModule };

export default new createStore({
  modules,
});
