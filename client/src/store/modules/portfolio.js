import {
  SETALLPORTFOLIOS,
  SETPORTFOLIO,
  SAVEALLPORTFOLIO,
  DELETEPORTFOLIE,
  GETALLSTRATEGIES,
} from "../mutationtype";
import axios from "axios";

const apiUrl = process.env.APIURL || "/";
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
      const apiUrl = process.env.APIURL || "/";
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
      const isNew = !item._id || item._id === 0 || item._id === "0";
      item.updateui = true;
      return axios
        .post(apiUrl + "portfolio/save", item)
        .then(function (res) {
          if (item.updateui) {
            const list = Array.isArray(res.data) ? res.data : [];
            commit(SETALLPORTFOLIOS, list);
            if (isNew && list.length) {
              const matches = list.filter((p) => p.name === item.name);
              const created =
                matches.sort(
                  (a, b) =>
                    new Date(b.modifiedon || b.createdon || 0) -
                    new Date(a.modifiedon || a.createdon || 0)
                )[0] || list[list.length - 1];
              if (created) {
                commit(SETPORTFOLIO, created);
                commit("strategyModule/" + GETALLSTRATEGIES, [], {
                  root: true,
                });
              }
            }
          } else {
            commit(SETPORTFOLIO, res.data[0] || res.data);
          }
          return res.data;
        })
        .catch((e) => {
          console.error(e);
        });
    },
    async DeletePortfolio({ commit }, item) {
      const id = item && (item._id || item.id);
      if (!id) {
        console.error("DeletePortfolio: missing portfolio id");
        return Promise.reject(new Error("Missing portfolio id"));
      }
      return axios
        .post(apiUrl + "portfolio/delete", { _id: id })
        .then(function (res) {
          if (res && res.status >= 200 && res.status < 300) {
            commit(DELETEPORTFOLIE, { _id: id });
            commit("strategyModule/" + GETALLSTRATEGIES, [], { root: true });
          }
          return res;
        })
        .catch((e) => {
          console.error("DeletePortfolio failed", e);
          throw e;
        });
    },
    async SaveAllPortfolio({ commit }, item) {
      axios
        .post(apiUrl + "portfolio/saveall", item)
        .then(function(res) {
          commit(SAVEALLPORTFOLIO, res.data);
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};

export default portfolioModule;
