import "dotenv/config";
import {
    BINDADDEDITTRADE,
    ADDEDITTRADE,
    DELETETRADE,
    CHANGECHECKSTATE,

} from "../mutationtype";


const axios = require("axios");
const apiUrl = process.env.VUE_APP_APIURL || "/";

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
            var foundIndex = strategies.findIndex(x => x._id == _strategy._id);
            if (foundIndex > -1) {
                strategies[foundIndex].trades = _strategy.trades;
            }
        },
        [DELETETRADE](state, { strategies, sid, tid }) {
            var foundIndex = strategies.findIndex(x => x._id == sid);
            if (foundIndex > -1) {
                var strategy = strategies[foundIndex];
                var tradeIndex = strategy.trades.findIndex(y => y._id == tid);
                if (tradeIndex > -1) {
                    strategy.trades.splice(tradeIndex, 1);
                }
            }
        },
        [CHANGECHECKSTATE](state, items) {
            var foundIndex = items.strategies.findIndex(x => x._id == items.strategy._id);
            if (foundIndex > -1) {
                items.strategies[foundIndex] = items.strategy
            }
        }
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
            return strategy.trades.sort(compare);
        },
        BindAddEditTrade({ commit, rootGetters, dispatch }, _strategy) {
            if (_strategy) {
                const _tradeDetail = {
                    symbol: _strategy.symbol,
                    sid: _strategy._id,
                    expiry: null,
                    buyorsell: "Sell", //Buy/Sell
                    tradetype: "Call", //Call/Put/Future
                    quantity: 1,
                    selectedstrike: 17500,
                    price: 30,
                    note: "",
                    order: _strategy.trades.length,
                };
                return axios.post(apiUrl + "trade/save", _tradeDetail).then(function (res) {
                    if (res.status == 200) {
                        var strategies = rootGetters["strategyModule/Strategies"];
                        var _strategy = res.data;
                        _strategy.trades.forEach(t => {
                            t.checked = true;
                        });
                        dispatch('SortTrades', _strategy);
                        commit(ADDEDITTRADE, { strategies, _strategy });
                        return _strategy;
                    }
                });
            } else {
                //commit(BINDADDEDITTRADE, null)
            }
        },
        AddEditTrade({ commit, rootGetters, dispatch }, _tradeDetail) {
            if (_tradeDetail) {
                axios.post(apiUrl + "trade/save", _tradeDetail).then(function (res) {
                    if (res.status == 200) {
                        var strategies = rootGetters["strategyModule/Strategies"];
                        var _strategy = res.data;
                        _strategy.trades.forEach(t => {
                            t.checked = true;
                        });
                        dispatch('SortTrades', _strategy);
                        commit(ADDEDITTRADE, { strategies, _strategy });
                    }
                });
            }
        },
        DeleteTrade({ commit, rootGetters}, { sid, tid }) {
            if (sid && tid) {
                axios.post(apiUrl + "trade/delete", { tid }).then(function (res) {
                    if (res.status == 200) {
                        var strategies = rootGetters["strategyModule/Strategies"];
                        // dispatch('SortTrades', strategy);
                        commit(DELETETRADE, { strategies, sid, tid });
                    }
                });
            }
        },
        CheckStateChanged({ commit, rootGetters, dispatch }, strategy) {
            var strategies = rootGetters["strategyModule/Strategies"];
            dispatch('SortTrades', strategy);
            commit(CHANGECHECKSTATE, { strategies, strategy });
        }
    }
};

export default tradeModule;