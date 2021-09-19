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
        [BINDADDEDITTRADE](state, _tradeDetail) {
            state.TradeDetail = _tradeDetail;
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
        BindAddEditTrade({ commit }, _strategy) {
            if (_strategy) {
                var _trade = {
                    symbol: !_strategy.ismultiplesymbol ? _strategy.symbol : undefined,
                    sid: _strategy._id,
                    lotsize: 1000,
                    expiry: null,
                    strikepricemin: 0,
                    strikepricemax: 0,
                    strikepricestep: 0.25,
                    buyorsell: "Sell", //Buy/Sell
                    tradetype: "Call", //Call/Put/Future
                    quantity: 1,
                    selectedstrike: 73.25,
                    price: 30,
                    note: "",
                };
                commit(BINDADDEDITTRADE, _trade);
            } else {
                commit(BINDADDEDITTRADE, null)
            }
        },
        AddEditTrade({ commit, rootGetters }, _tradeDetail) {
            if (_tradeDetail) {
                axios.post(apiUrl + "trade/save", _tradeDetail).then(function (res) {
                    if (res.status == 200) {
                        var strategies = rootGetters["strategyModule/Strategies"];
                        var _strategy = res.data;
                        commit(ADDEDITTRADE, { strategies, _strategy });
                    }
                });
            }
        },
        DeleteTrade({ commit, rootGetters }, { sid, tid }) {
            if (sid && tid) {
                axios.post(apiUrl + "trade/delete", { tid }).then(function (res) {
                    if (res.status == 200) {
                        var strategies = rootGetters["strategyModule/Strategies"];
                        commit(DELETETRADE, { strategies, sid, tid });
                    }
                });
            }
        },
        CheckStateChanged({ commit, rootGetters }, _strategy) {
            var strategies = rootGetters["strategyModule/Strategies"];
            commit(CHANGECHECKSTATE, { strategies, strategy: _strategy });
        }
    }
};

export default tradeModule;