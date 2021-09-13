import "dotenv/config";
import {
    BINDADDEDITTRADE,
    ADDEDITTRADE,
    DELETETRADE,

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
        


    }
    ,
    mutations: {
        [BINDADDEDITTRADE](state, _tradeDetail) {
            state.TradeDetail = _tradeDetail;
        },
        [ADDEDITTRADE]({ state, rootState }, _strategy) {

            var strategyIndex = this.getStrategies.findIndex(x => x._id == _strategy._id);
            if (strategyIndex > -1) {
                this.Strategies[strategyIndex].trades = _strategy.trades;
            }
        },
        [DELETETRADE](state, {_rootGetters, sid, tid }) {

            var foundIndex = _rootGetters.strategyModule.Strategies.findIndex(x => x._id == sid);
            if (foundIndex > -1) {
                var strategy = _rootGetters.Strategies[foundIndex];
                var tradeIndex = strategy.trades.findIndex(y => y._id == tid);
                if (tradeIndex > -1) {
                    strategy.trades.splice(tradeIndex, 1);
                }
            }
        },
    },
    actions: {
        BindAddEditTrade({ commit }, _strategy) {
            if (_strategy) {
                var _trade = {
                    symbol: !_strategy.ismultiplesymbol ? _strategy.symbol : undefined,
                    sid: _strategy._id,
                    lotsize: 1000,
                    expiry: null,
                    strikepricemin: 70,
                    strikepricemax: 75,
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
        AddEditTrade({ commit }, _tradeDetail) {
            if (_tradeDetail) {
                axios.post(apiUrl + "trade/save", _tradeDetail).then(function (res) {
                    if (res.status == 200) {
                        ///res.data is strategy
                        res.data.name = "anand";
                        commit(ADDEDITTRADE, res.data);
                    }
                });
            }
        },
        DeleteTrade({ commit, rootGetters }, { sid, tid }) {
            if (sid && tid) {
                axios.post(apiUrl + "trade/delete", { tid }).then(function (res) {
                    if (res.status == 200) {
                        //console.log('Delete rootState.Strategies :>> ', rootState.strategyModule.Strategies);
                        console.log('_rootGetters :>> ', rootGetters);
                        debugger;
                        console.log('_rootGetters.strategyModule :>> ', rootGetters.strategyModule);
                        console.log('_rootGetters.strategyModule.Strategies :>> ', rootGetters.strategyModule.Strategies);
                        commit(DELETETRADE, { rootGetters, sid, tid });
                    }
                });
            }
        }
    }
};

export default tradeModule;