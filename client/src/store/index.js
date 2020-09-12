import Vuex from "vuex";
import Vue from "vue";


import {
  GETALLPORTFOLIOS,
  SETPORTFOLIO,
  GETINSTRUMENTDETAIL,
  REMOVETRADE,
  ONSTRIKEPRICERANGECHANGING,
  ONSTRIKEPRICERANGECHANGED,
  TRADEADDEDIT,
  SETSELECTEDSTRATEGY
} from "./mutationtype";

Vue.use(Vuex);
const axios = require("axios");
const state = {
  Portfolios: [],
  //Strategies: [],
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

  [GETINSTRUMENTDETAIL](state, _data) {
    state.InsurumentDetail = _data;
  },
  [REMOVETRADE](state, _strategy) {
    var inx = state.Portfolio.Strategies.findIndex(
      (x) => x._id.$oid == _strategy._id.$oid
    );
    state.Portfolio.Strategies.splice(inx, 1, _strategy);
  },
  [ONSTRIKEPRICERANGECHANGING](state, _price) {
    state.SelectedStrikePrice = _price;
  },
  [ONSTRIKEPRICERANGECHANGED]() {
    //state.SelectedStrikePrice = _price;
  },
  [TRADEADDEDIT](_strategy, _trade) {
    // console.clear();
    // console.log(_strategy);
    // console.log(_trade);

    if(state.Strategy._oid == _strategy._oid){
      if(!state.Strategy.Trades){
        state.Strategy.Trades = [];
      }
      state.Strategy.Trades.push(_trade);
    }
  },
  [SETSELECTEDSTRATEGY]( _strategy){
    state.Strategy = _strategy;
  }
};
const actions = {
  async GetAllPortfolios({ commit }) {
    console.log(process.env.EXPRESSSERVICE);
    const response = await axios.get("http://192.168.0.6:9090/portfolio");
    commit(GETALLPORTFOLIOS, response.data);
  },
  SelectPortfolioChanged({ commit }, _protfolio) {
    commit(SETPORTFOLIO, _protfolio);
  },
  // ShowNewTrade({ commit }, _strategy) {
  //   _strategy.IsEdit = !_strategy.IsEdit;
  //   commit(SHOWNEWTRADE, _strategy);
  // },
  async GetPortfolioById({ commit }, _id) {
    commit(SETPORTFOLIO, _id);
    // var _protfolio = state.Portfolios.find((x) => x._id.$oid == _id);
    // _protfolio.Strategies.forEach((x) => {
    //   x.IsEdit = false;
    // });

    // commit(SETPORTFOLIO, _protfolio);
  },

  async GetInstrumentDetail({ commit }) {
    const response = await axios.get("/chart-databyindex.json");
    commit(GETINSTRUMENTDETAIL, response.data);
  },
  async GetLiveDetail() {
    await axios.get("/liveEquity-derivatives.json");
  },

  RemoveTrade({ commit }, { _strategy, _trade }) {
    _strategy.Trades = _strategy.Trades.filter(
      (x) => x._id.$oid != _trade._id.$oid
    );
    commit(REMOVETRADE, _strategy);
  },
  OnStrikePriceRangeChanging({ commit }, evnt) {
    console.log("changing called" + evnt.target.value);
    commit(ONSTRIKEPRICERANGECHANGING, evnt.target.value);
  },
  OnStrikePriceRangeChanged({ commit }, evnt) {//{ commit },evnt){
    console.log(evnt);
    console.log("changed called");
    commit(ONSTRIKEPRICERANGECHANGED);
  },
  async TradeAddEdit({ commit }, _strategy, _trade) {

    commit(TRADEADDEDIT,_strategy, _trade);
  },
  SetSelectedStrategy({ commit }, _strategy,_trade) {
    commit(SETSELECTEDSTRATEGY, _strategy, _trade);
  }

};
const modules = {};

const getters = {
  getLatestPrice: function (state) {
    if (state.InsurumentDetail && state.InsurumentDetail.grapthData) {
      var inx = state.InsurumentDetail.grapthData.length;
      var _data = state.InsurumentDetail.grapthData[inx - 1];
      console.log(_data[1]);
      return _data[1];
    }
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules,
  getters,
});
