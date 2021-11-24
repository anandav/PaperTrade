import "dotenv/config";
import {
    
    SETEXCHANGEDETAIL,
    SETCURRENTEXCHANGE,
} from "../mutationtype";

const axios = require("axios");
const apiUrl = process.env.VUE_APP_APIURL || "/";

export default {
    namespaced: true,
    state: {
        CurrentExchange: "",
        Exchanges: [],
        SymbolTypes: [],
        Symbols: [],

    },
    getters: {
        CurrentExchange: state => {
            return state.CurrentExchange;
        },
        Exchanges: state => {
            return state.Exchanges;
        },
        Types: state => {
            return state.SymbolTypes;
        },
        Symbols: state => {
            return state.Symbols;
        },

    },
    mutations: {
        [SETEXCHANGEDETAIL](state, data) {
            console.log('data :>> ', data);
            state.Exchanges = data.ExchangeDetail.Exchanges;
            state.SymbolTypes = data.ExchangeDetail.Types;
            state.Symbols = data.ExchangeDetail.Symbols;
        },
        [SETCURRENTEXCHANGE](state, currentExchange) {
            state.CurrentExchange = currentExchange;
        },
    },
    actions: {
        PortfolioLoad({ commit, getters }, { portfolio, action }) {
            let postData = {
                portfolio,
                action,
            };
            let url = `${apiUrl}data/`;
            if (portfolio.exchange != getters.CurrentExchange || action == "init") {
                axios.post(url, postData).then(function (res) {
                    if (res.status == 200) {
                        console.log('res.data :>> ', res.data);
                        commit(SETEXCHANGEDETAIL, res.data);
                    }
                });
                if (portfolio.exchange) {
                    commit(SETCURRENTEXCHANGE, portfolio.exchange);
                }
            }

        },
        // onStrategyLoad({ commit, getters }, { portfolio, strategy, action }) {
        //     axios.post(url, postData).then(function (res) {
        //         if (res.status == 200) {
        //             //console.log('res.data :>> ', res.data);
        //             commit(ADDEDITSTRATEGY, res.data, { root: true });
        //         }
        //     });
        // },
        // onStrategySymbolChange({ commit, getters }, { strategy, action }) {
        // },
        // onStrategyDateExpiry({ commit, getters }, { strategy, action }) {
        // },

    }
};