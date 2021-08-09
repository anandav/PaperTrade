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
            commit(GETALLSTRATEGIES, res.data);
        });
    },
    AddEditStrategy({ commit }, item) {
        axios.post(apiUrl + "strategy/save", item).then(function (res) {
            if (res.status == 200) {
                commit(ADDEDITSTRATEGY, item);
            }
        })
    },
    DeleteStrategy({ commit }, item) {
        axios.post(apiUrl + "strategy/delete", item).then(function (res) {
            if (res.status == 200) {
                commit(DELETESTRATEGY, item._id);
            }
        })
    }
};

