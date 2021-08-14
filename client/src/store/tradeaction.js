import "dotenv/config";
const axios = require("axios");
const apiUrl = process.env.VUE_APP_APIURL || "/";

import {
    ADDEDITTRADE,
} from "./mutationtype";

export default {
    AddEditTrade({ commit }, _strategy) {
        if (_strategy.BindingValues) {
            var _newstrategy = { ..._strategy.BindingValues, sid: _strategy._id }
            axios.post(apiUrl + "trade/save", _newstrategy).then(function (res) {
                console.log(res);
                if (res.status == 200) {
                    commit(ADDEDITTRADE, _strategy);
                }
            });
        }
    }
}