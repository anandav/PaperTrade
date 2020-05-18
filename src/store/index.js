import Vuex from "vuex";
import Vue from "vue";

import {
  //GETPORTFOLIOBYID,
  //  ADDEDITSTRATEGY,
  GETALLPORTFOLIOS,
  SETPORTFOLIO,
  SHOWNEWTRADE,
} from "./mutationtype";

Vue.use(Vuex);
const axios = require("axios");
const state = {
  Portfolios: [],
  //Strategies: [],
  Portfolio: undefined,
  Strategy: undefined,
  Trade: undefined,
};
const mutations = {
  [GETALLPORTFOLIOS](state, _portfolios) {
    state.Portfolios = _portfolios;
  },
  [SETPORTFOLIO](state, _protfolio) {
    state.Portfolio = _protfolio;
  },
  [SHOWNEWTRADE](state, _strategy) {
    _strategy.IsEdit = _strategy.IsEdit ? !_strategy.IsEdit : true;
    //state.Strategy = _strategy;
    //state.Strategy.IsEdit = true;
  },
};
const actions = {
  async GetAllPortfolios({ commit }) {
    const response = await axios.get("/collectiondata.json");
    //console.log(response.data);
    commit(GETALLPORTFOLIOS, response.data);
  },
  SelectPortfolioChanged({ commit }, _protfolio) {
    commit(SETPORTFOLIO, _protfolio);
  },
  ShowNewTrade({ commit }, _strategy) {
    
    console.log("_strategy.IsEdit :" + _strategy.IsEdit);
    commit(SHOWNEWTRADE, _strategy);
  },
  async GetPortfolioById({ commit }, _id) {
    //await this.GetAllPortfolios();
    var _protfolio = state.Portfolios.find(x => x._id.$oid == _id);
    commit(SETPORTFOLIO, _protfolio);
  },
  // async AddEditStrategy(_strategy) {},
  // async AddEditTrade(_trade) {},
};
const modules = {};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules,
});
