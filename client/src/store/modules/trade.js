import "dotenv/config";
import {
  BINDADDEDITTRADE,
  ADDEDITTRADE,
  DELETETRADE,
  CHANGECHECKSTATE,
} from "../mutationtype";

import axios from "axios";
const apiUrl = process.env.APIURL || "/";

function isOk(res) {
  return res && res.status >= 200 && res.status < 300 && res.data;
}

function normalizeStrategyTrades(_strategy) {
  if (!_strategy) {
    return _strategy;
  }
  if (!Array.isArray(_strategy.trades)) {
    _strategy.trades = [];
  }
  _strategy.trades.forEach((t) => {
    if (t.checked === undefined) {
      t.checked = true;
    }
  });
  return _strategy;
}

const tradeModule = {
  namespaced: true,
  state: {
    TradeDetail: undefined,
  },
  getters: {
    TradeDetail: function (state) {
      return state.TradeDetail;
    },
  },
  mutations: {
    [BINDADDEDITTRADE](state, { _strategy, _trade }) {
      _strategy.trades.push(_trade);
    },
    [ADDEDITTRADE](state, { strategies, _strategy }) {
      var foundIndex = strategies.findIndex((x) => x._id == _strategy._id);
      if (foundIndex > -1) {
        const current = strategies[foundIndex];
        const prevChecked = {};
        (current.trades || []).forEach((t) => {
          if (t && t._id != null) {
            prevChecked[t._id] = t.checked;
          }
        });
        const trades = Array.isArray(_strategy.trades) ? _strategy.trades : [];
        trades.forEach((t) => {
          if (t._id != null && prevChecked[t._id] !== undefined) {
            t.checked = prevChecked[t._id];
          } else if (t.checked === undefined) {
            t.checked = true;
          }
        });
        current.trades = trades;
        Object.keys(_strategy).forEach((key) => {
          if (key !== "trades") {
            current[key] = _strategy[key];
          }
        });
      }
    },
    [DELETETRADE](state, { strategies, sid, tid }) {
      var foundIndex = strategies.findIndex((x) => x._id == sid);
      if (foundIndex > -1) {
        var strategy = strategies[foundIndex];
        var tradeIndex = strategy.trades.findIndex((y) => y._id == tid);
        if (tradeIndex > -1) {
          strategy.trades.splice(tradeIndex, 1);
        }
      }
    },
    [CHANGECHECKSTATE](state, items) {
      var foundIndex = items.strategies.findIndex(
        (x) => x._id == items.strategy._id
      );
      if (foundIndex > -1) {
        items.strategies[foundIndex] = items.strategy;
      }
    },
  },
  actions: {
    SortTrades(context, strategy) {
      const compare = function (a, b) {
        if (a.order < b.order) {
          return -1;
        }
        if (a.order > b.order) {
          return 1;
        }
        return 0;
      };
      if (!strategy.trades) {
        strategy.trades = [];
      }
      return strategy.trades.sort(compare);
    },
    BindAddEditTrade({ commit, rootGetters, dispatch }, _strategy) {
      if (!_strategy) {
        return Promise.resolve();
      }
      if (!Array.isArray(_strategy.trades)) {
        _strategy.trades = [];
      }
      const _tradeDetail = {
        symbol: _strategy.symbol,
        sid: _strategy._id,
        expiry: null,
        buyorsell: "Sell",
        tradetype: "Call",
        quantity: 1,
        selectedstrike: 19500,
        price: 30,
        note: "",
        order: _strategy.trades.length,
      };
      return axios.post(apiUrl + "trade/save", _tradeDetail).then(function (res) {
        if (isOk(res)) {
          var strategies = rootGetters["strategyModule/Strategies"];
          var saved = normalizeStrategyTrades(res.data);
          dispatch("SortTrades", saved);
          commit(ADDEDITTRADE, { strategies, _strategy: saved });
          return saved;
        }
      });
    },
    AddEditTrade({ commit, rootGetters, dispatch }, _tradeDetail) {
      if (!_tradeDetail) {
        return Promise.resolve();
      }
      return axios.post(apiUrl + "trade/save", _tradeDetail).then(function (res) {
        if (isOk(res)) {
          var strategies = rootGetters["strategyModule/Strategies"];
          var saved = normalizeStrategyTrades(res.data);
          dispatch("SortTrades", saved);
          commit(ADDEDITTRADE, { strategies, _strategy: saved });
          return saved;
        }
      });
    },
    DeleteTrade({ commit, rootGetters }, { sid, tid }) {
      if (!sid || !tid) {
        return Promise.resolve();
      }
      return axios.post(apiUrl + "trade/delete", { tid }).then(function (res) {
        if (res && res.status >= 200 && res.status < 300) {
          var strategies = rootGetters["strategyModule/Strategies"];
          commit(DELETETRADE, { strategies, sid, tid });
        }
      });
    },
    CheckStateChanged({ commit, rootGetters, dispatch }, strategy) {
      var strategies = rootGetters["strategyModule/Strategies"];
      dispatch("SortTrades", strategy);
      commit(CHANGECHECKSTATE, { strategies, strategy });
      return Promise.resolve(strategy);
    },
  },
};

export default tradeModule;
