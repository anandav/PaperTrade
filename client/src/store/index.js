import Vuex from "vuex";
import Vue from "vue";
import portfolioActions from "./portfoliactions";
//import "dotenv/config";


Vue.use(Vuex);
import {
  GETALLPORTFOLIOS,
  SETPORTFOLIO,
  DELETEPORTFOLIE,
} from "./mutationtype";

const state = {
  Portfolios: [],
  Strategies: [],
  Portfolio: undefined,
  Strategy: undefined,
  Trade: undefined,
  InsurumentDetail: undefined,
  InsurumentLatestPirce: undefined,
  SelectedStrikePrice: 0,
  SelectedStrike: undefined,
};
const mutations = {
  [GETALLPORTFOLIOS](state, _portfolios) {
    state.Portfolios = _portfolios;
  },
  [SETPORTFOLIO](state, _protfolio) {
    state.Portfolio = _protfolio;
  },
  [DELETEPORTFOLIE](state, _protfolio) {
    console.log("Porfolio Delete Mutation called")
    var _index = state.Portfolios.findIndex(x => x._id == _protfolio._id);
    if (_index > -1) {
      state.Portfolios.splice(_index, 1);
      console.log("Porfolio Delete from state.")
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
  actions: { ...portfolioActions },
  modules,
  getters,
});
