import "dotenv/config";
const axios = require("axios");
const apiUrl = process.env.VUE_APP_APIURL || "/";
import {
    GETALLSTRATEGIES,
    ADDEDITSTRATEGY,
    DELETESTRATEGY
} from "./mutationtype";

export default {
    async GetAllStrategies({ commit }, item) {
        axios.post(apiUrl + "strategy/findusingportfolioid", {
            "fieldName": "portfolio",
            "fieldValue": item,
        }).then(function (res) {
            if (res.data) {

                var _vals = {
                    StrikePriceMin: 14000,
                    StrikePriceMax: 20000,
                    StrikePriceStep: 50,
                    // buyOrSell: "Sell", //Buy/Sell
                    // tradeType: "Put", //Call/Put/Future
                    // selectedStrikePrice: 16500,
                    // spotPrice: 16530,
                };
                for (let index = 0,_len = res.data.length; index < _len; index++) {
                    res.data[index].BindingValues = _vals;
                }
            }
            commit(GETALLSTRATEGIES, res.data);
        });
    },
    AddEditStrategy({ commit }, item) {
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



};

