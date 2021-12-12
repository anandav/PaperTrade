import "dotenv/config";
import {
  SETALLPORTFOLIOS,
  SETPORTFOLIO,
  SAVEALLPORTFOLIO,
  DELETEPORTFOLIE,
} from "../mutationtype";

const axios = require("axios");
const apiUrl = process.env.VUE_APP_APIURL || "/";
const portfolioModule = {
  namespaced: true,
  state: {
    Portfolios: [],
    Portfolio: undefined,
  },
  getters: {
    Portfolios: (state) => {
      return state.Portfolios;
    },
    Portfolio: (state) => {
      return state.Portfolio;
    },
  },
  mutations: {
    [SETALLPORTFOLIOS](state, _portfolios) {
      state.Portfolios = _portfolios;
    },
    [SAVEALLPORTFOLIO](state, _portfolios) {
      state.Portfolios = _portfolios;
    },
    [SETPORTFOLIO](state, _protfolio) {
      state.Portfolio = _protfolio;
    },
    [DELETEPORTFOLIE](state, _protfolio) {
      var _index = state.Portfolios.findIndex((x) => x._id == _protfolio._id);
      if (_index > -1) {
        state.Portfolios.splice(_index, 1);
      }
      state.Portfolio = undefined;
    },
  },
  actions: {
    async GetAllPortfolios({ commit }) {
      const response = await axios.get(apiUrl + "portfolio");
      commit(SETALLPORTFOLIOS, response.data);
    },
    async SelectPortfolioChanged({ commit }, _protfolio) {
      commit(SETPORTFOLIO, _protfolio);
    },
    async GetPortfolioById({ commit }, item) {
      axios
        .post(apiUrl + "portfolio/find", {
          fieldName: "_id",
          fieldValue: item._id,
        })
        .then(function(res) {
          commit(SETPORTFOLIO, res.data[0]);
        });
    },
    async SavePortfolio({ commit }, item) {
      item.updateui = true;
      axios
        .post(apiUrl + "portfolio/save", item)
        .then(function(res) {
          if (item.updateui) {
            commit(SETALLPORTFOLIOS, res.data);
          } else {
            commit(SETPORTFOLIO, res.data[0]);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    async DeletePortfolio({ commit }, item) {
      axios.post(apiUrl + "portfolio/delete", item).then(function() {
        commit(DELETEPORTFOLIE, item);
      });
    },
    async SaveAllPortfolio({ commit }, item) {
      axios
        .post(apiUrl + "portfolio/saveall", item)
        .then(function(res) {
          console.log('res.data :>> ', res.data);
          commit(SAVEALLPORTFOLIO, res.data);
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};

export default portfolioModule;
