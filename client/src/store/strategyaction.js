import "dotenv/config";
const axios = require("axios");
const apiUrl = process.env.VUE_APP_APIURL || "/";
import {
    GETALLSTRATEGIES,
    ADDEDITSTRATEGY,
    DELETESTRATEGY
} from "./mutationtype";
//import { GetTodayDate } from '../shared/utilitymixins';

export default {
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
            name: "NEW",
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



};

