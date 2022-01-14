import "dotenv/config";
import {
    GETALLSTRATEGIES,
    ADDEDITSTRATEGY,
    DELETESTRATEGY,
    SETEXCHANGEDETAIL,
} from "../mutationtype";

const axios = require("axios");
const apiUrl = process.env.VUE_APP_APIURL || "/";
const strategyModule = {
    namespaced: true,
    state: {
        Strategies: [],

    },
    getters: {
        Strategies: state => {
            return state.Strategies;
        },
    },
    mutations: {
        [GETALLSTRATEGIES](state, _strategies) {
            state.Strategies = _strategies;
            state.Strategies.forEach(s => {
                s.x0 = s.x1 = undefined;
                s.trades.forEach(t => { t.checked = undefined; });

            });
        },
        [ADDEDITSTRATEGY](state, _strategy) {
            var foundIndex = state.Strategies.findIndex(x => x._id == _strategy._id);
            if (foundIndex > -1) {
                Object.assign(state.Strategies[foundIndex], _strategy);
            } else {
                state.Strategies.unshift(_strategy);
            }
        },
        [DELETESTRATEGY](state, _strategyId) {
            for (let i = 0, l = state.Strategies.length; i < l; i++) {
                if (state.Strategies[i]._id == _strategyId) {
                    state.Strategies.splice(i, 1);
                    return;
                }
            }
        },
        [SETEXCHANGEDETAIL](state, exchangeDetail) {
            state.ExchangeDetail = exchangeDetail
        },

    },
    actions: {
        GetAllStrategies: async function ({ commit }, item) {
            axios.post(apiUrl + "strategy/findusingportfolioid", {
                "fieldName": "portfolio",
                "fieldValue": item._id,
            }).then(function (res) {
                if (res.data) {
                    commit(GETALLSTRATEGIES, res.data);
                }
            });
        },
        AddStrategy({ commit }, _pid) {
            var item = {
                name: "Strategy",
                description: "",
                symbol: "NIFTY",
                portfolio: _pid,
                lotsize: 50,
                strikepricestep: 50,
            };
            axios.post(apiUrl + "strategy/save", item).then(function (res) {
                if (res.status == 200) {
                    res.data.isedit = true;
                    commit(ADDEDITSTRATEGY, res.data);
                }
            });
        },
        EditStrategy({ commit }, item) {
            axios.post(apiUrl + "strategy/save", item).then(function (res) {
                if (res.status == 200) {
                    commit(ADDEDITSTRATEGY, res.data);
                }
            });
        },
        DeleteStrategy({ commit }, item) {
            axios.post(apiUrl + "strategy/delete", item).then(function (res) {
                if (res.status == 200) {
                    commit(DELETESTRATEGY, item._id);
                }
            })
        },
        MoveStrategy({ commit }, { Strategy, PortfolioID }) {
            Strategy.portfolio = PortfolioID;
            axios.post(apiUrl + "strategy/save", Strategy).then(function (res) {
                if (res.status == 200) {
                    commit(DELETESTRATEGY, res.data._id);
                }
            });
        },
        MergeStrategy({ commit, rootGetters }, { SourceStrategy, DestinationStrategyID }) {
            const allStrategies = rootGetters["strategyModule/Strategies"];

            let DestinationStrategy;
            allStrategies.forEach(x => {
                if (x._id == DestinationStrategyID) {
                    DestinationStrategy = x;
                }
            })

            if (DestinationStrategy && SourceStrategy.symbol == DestinationStrategy.symbol
                && SourceStrategy.lotsize == DestinationStrategy.lotsize
                && SourceStrategy.strikepricestep == DestinationStrategy.strikepricestep) {


                SourceStrategy.trades.forEach(x => { x._id = undefined; });
                DestinationStrategy.trades = [...DestinationStrategy.trades, ...SourceStrategy.trades];
                axios.post(apiUrl + "strategy/save", DestinationStrategy).then(function () {
                    axios.post(apiUrl + "strategy/delete", SourceStrategy).then(function (res2) {
                        if (res2.status == 200) {
                            commit(DELETESTRATEGY, SourceStrategy._id);
                        }
                    });
                });
            } else {
                console.error("Source and destination strategy not matching (Symbol/Lot size/Strike Price Step).");
            }
        },
        AddStrategyFromDataModule({ dispatch }, Strategy) {
            dispatch("EditStrategy", Strategy);
        },
        CommitStrategy({ commit }, Strategy) {
            commit(ADDEDITSTRATEGY, Strategy);
        }
    },
};

export default strategyModule;