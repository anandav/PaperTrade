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

} from "./mutationtype";

const state = {
  Portfolios: [],
  Strategies: [],
  Portfolio: undefined,
  // NewStrategyPlaceHolder: undefined,
  // Trade: undefined,
  // InsurumentDetail: undefined,
  // InsurumentLatestPirce: undefined,
  // SelectedStrikePrice: 0,
  // SelectedStrike: undefined,
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

  [BINDADDEDITTRADE](state, {_strategy, _symbolDetail}) {
    var foundIndex = state.Strategies.findIndex(x => x._id == _strategy._id);
    if (foundIndex > -1) {
      state.Strategies[foundIndex].BindAddEditTrade = _symbolDetail;
    }



  }
};

const modules = {};

const getters = {
  getLatestPrice: function (state) {
    if (state.InsurumentDetail && state.InsurumentDetail.grapthData) {
      var inx = state.InsurumentDetail.grapthData.length;
      var _data = state.InsurumentDetail.grapthData[inx - 1];
      return _data[1];
    }
  },
  getPortfolioById: function (state) {
    return state.Portfolio;
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions: { ...portfolioActions, ...strategyActions, ...tradeActions },
  modules,
  getters,
});
