import Vuex from "vuex";
import Vue from "vue";
import portfolioActions from "./portfoliactions";
import strategyActions from "./strategyaction";
import tradeActions from "./tradeaction";

Vue.use(Vuex);
import {
  //Portfolio
  GETALLPORTFOLIOS,
  SETPORTFOLIO,
  DELETEPORTFOLIE,
  //Startegy
  GETALLSTRATEGIES,
  ADDEDITSTRATEGY,
  DELETESTRATEGY,
  //trade
  BINDADDEDITTRADE,
  ADDEDITTRADE,
  DELETETRADE,


} from "./mutationtype";

const state = {
  Portfolios: [],
  Strategies: [],
  Portfolio: undefined,
  TradeDetail: undefined,
  இலாகாக்கள் : [],
  உத்திகள் : [],
  வர்த்தகங்கள் : undefined,
  சோதனை: undefined,
  
};
const mutations = {
  [GETALLPORTFOLIOS](state, _portfolios) {
    state.Portfolios = _portfolios;
  },
  [SETPORTFOLIO](state, _protfolio) {
    state.Portfolio = _protfolio;
  },
  [DELETEPORTFOLIE](state, _protfolio) {
    var _index = state.Portfolios.findIndex(x => x._id == _protfolio._id);
    if (_index > -1) {
      state.Portfolios.splice(_index, 1);
    }
  },
  [GETALLSTRATEGIES](state, _strategies) {
    state.Strategies = _strategies;
  },
  [ADDEDITSTRATEGY](state, _strategy) {
    var foundIndex = state.Strategies.findIndex(x => x._id == _strategy._id);
    if (foundIndex > -1) {
      state.Strategies[foundIndex] = _strategy;
    } else {
      state.Strategies.unshift(_strategy);
    }
  },
  [DELETESTRATEGY](state, _strategyId) {
    for (let i = 0, l = state.Strategies.length; i < l; i++) {
      if (state.Strategies[i]._id == _strategyId) {
        state.Strategies.splice(i, 1);
        return;
      }
    }
  },
  [BINDADDEDITTRADE](state, _tradeDetail) {
    state.TradeDetail = _tradeDetail;
  },
  [ADDEDITTRADE](state, _strategy) {
    var strategyIndex = state.Strategies.findIndex(x => x._id == _strategy._id);
    if (strategyIndex > -1) {
      state.Strategies[strategyIndex].trades = _strategy.trades;
    }
  },
  [DELETETRADE](state, { sid, tid }) {
    var foundIndex = state.Strategies.findIndex(x => x._id == sid);
    if (foundIndex > -1) {
      var strategy = state.Strategies[foundIndex];
      var tradeIndex = strategy.trades.findIndex(y => y._id == tid);
      if (tradeIndex > -1) {
        strategy.trades.splice(tradeIndex, 1);
      }
    }
  },
};

const modules = {};
const getters = {
  TradeDetail: (state) => {
    return state.TradeDetail;
  }
};


export default new Vuex.Store({
  state,
  mutations,
  actions: { ...portfolioActions, ...strategyActions, ...tradeActions },
  modules,
  getters,
});
