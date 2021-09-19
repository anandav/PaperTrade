import "dotenv/config";
import {
    GETALLSTRATEGIES,
    ADDEDITSTRATEGY,
    DELETESTRATEGY,
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
                state.Strategies[foundIndex] = _strategy;
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
    },
    actions: {
        async GetAllStrategies({ commit }, item) {
            axios.post(apiUrl + "strategy/findusingportfolioid", {
                "fieldName": "portfolio",
                "fieldValue": item,
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
                isEdit: true,
            };
            axios.post(apiUrl + "strategy/save", item).then(function (res) {
                if (res.status == 200) {
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
    }
};

export default strategyModule;