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
                
                // for (let index = 0, _len = res.data.length; index < _len; index++) {
                //     var _symbol;
                //     if (!res.data[index].ismultiplesymbol) {
                //         _symbol = res.data[index].symbol
                //         console.log(_symbol);
                //     }else{
                //         console.log("Multiple symbol");
                //     }
                    
                //     var _vals = {
                //         symbol: !res.data[index].ismultiplesymbol ? res.data[index].symbol : undefined,
                //         lotsize: 50,
                //         expiry: null,
                //         strikepricemin: 14000,
                //         strikepricemax: 20000,
                //         strikepricestep: 50,
                //         buyorsell: "", //Buy/Sell
                //         tradetype: "", //Call/Put/Future
                //         quantity: 1,
                //         selectedstrike: 16500,
                //         spotprice: 16530,
                //         note: "",

                //     };
                //     res.data[index].BindingValues = _vals;
                // }
                commit(GETALLSTRATEGIES, res.data);
            }
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

