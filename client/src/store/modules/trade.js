import "dotenv/config";
import { mapGetters } from "vuex";

const axios = require("axios");
const apiUrl = process.env.VUE_APP_APIURL || "/";
import {
    BINDADDEDITTRADE,
    ADDEDITTRADE,
    DELETETRADE,

} from "../mutationtype";

const tradeModule = {
    namespaced: true,
    computed: {
        ...mapGetters(
            ["Strategies"]

            //     [
            //     'some/nested/module/someGetter', // -> this['some/nested/module/someGetter']
            //     'some/nested/module/someOtherGetter', // -> this['some/nested/module/someOtherGetter']
            //   ]
        )
        //...mapGetters('strategyModule',["Strategies"]),
    },
   
    state: {
        TradeDetail: undefined,
    },
    getters: {
        TradeDetail: (state) => {
            return state.TradeDetail;
        }

    }
    ,
    mutations: {
        [BINDADDEDITTRADE](state, _tradeDetail) {
            state.TradeDetail = _tradeDetail;
        },
        [ADDEDITTRADE](state, _strategy) {
            var strategyIndex = this.Strategies.findIndex(x => x._id == _strategy._id);
            if (strategyIndex > -1) {
                this.Strategies[strategyIndex].trades = _strategy.trades;
            }
        },
        [DELETETRADE](state, { sid, tid }) {
            var foundIndex = this.Strategies.findIndex(x => x._id == sid);
            if (foundIndex > -1) {
                var strategy = this.Strategies[foundIndex];
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
        DeleteTrade({ commit }, { sid, tid }) {
            if (sid && tid) {
                axios.post(apiUrl + "trade/delete", { tid }).then(function (res) {
                    if (res.status == 200) {
                        commit(DELETETRADE, { sid, tid });
                    }
                });
            }
        }
    }
};

export default tradeModule;