import "dotenv/config";
const axios = require("axios");
const apiUrl = process.env.VUE_APP_APIURL || "/";

import {
    BINDADDEDITTRADE,
    ADDEDITTRADE,
    DELETETRADE,

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
                spotprice: 30,
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
    DeleteTrade({ commit }, {sid, tid}) {
        if (sid && tid) {
            axios.post(apiUrl + "trade/delete", { tid }).then(function (res) {
                if (res.status == 200) {
                    commit(DELETETRADE, {sid, tid});
                }
            });
        }
    }
}