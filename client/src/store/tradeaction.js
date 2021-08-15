import "dotenv/config";
const axios = require("axios");
const apiUrl = process.env.VUE_APP_APIURL || "/";

import {
    BINDADDEDITTRADE,
    ADDEDITTRADE,

} from "./mutationtype";

export default {
    BindAddEditTrade({ commit }, _strategy) {
        if (_strategy) {
            var _trade = {
                symbol: !_strategy.ismultiplesymbol ? _strategy.symbol : undefined,
                sid: _strategy._id,
                lotsize: 50,
                expiry: null,
                strikepricemin: 14000,
                strikepricemax: 20000,
                strikepricestep: 50,
                buyorsell: "Sell", //Buy/Sell
                tradetype: "Call", //Call/Put/Future
                quantity: 1,
                selectedstrike: 16500,
                spotprice: 16530,
                note: "",
            };
            commit(BINDADDEDITTRADE, _trade);
        } else {
            commit(BINDADDEDITTRADE, null)
        }
    },
    AddEditTrade({ commit }, _tradeDetail) {
        console.log(_tradeDetail);
        if (_tradeDetail) {
            axios.post(apiUrl + "trade/save", _tradeDetail).then(function (res) {
                if (res.status == 200) {
                    commit(ADDEDITTRADE, _tradeDetail);
                }
            });
        }
    },

}