import "dotenv/config";
const axios = require("axios");
const apiUrl = process.env.VUE_APP_APIURL || "/";
import {
    GETALLSTRATEGIES 
} from "./mutationtype";

export default  {
    async GetAllStrategies({ commit }, item) {
        console.log(item);
        axios.post(apiUrl + "strategy/findusingportfolioid", {
            "fieldName": "portfolio",
            "fieldValue": item,

        }).then(function (res) {
            commit(GETALLSTRATEGIES, res.data);
        });
    },
    //async GetAllStrategy ({commit}) { },

};

