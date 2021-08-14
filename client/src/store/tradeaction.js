import "dotenv/config";
// const axios = require("axios");
// const apiUrl = process.env.VUE_APP_APIURL || "/";

// import {
//     //BINDADDEDITTRADE,
//     ADDEDITTRADE,
// } from "./mutationtype";

export default {
    AddEditTrade({commit}, _strategy) {
        
        console.log(_strategy);
        if (_strategy.BindingValues) {
            var _newstrategy = { ..._strategy.BindingTradeData, sid: _strategy._id }
            console.log(_newstrategy);
            console.log(commit);
        }
    }
        // AddEditTrade({ commit }, _strategy) {



        //     if (_strategy.BindingTradeData) {
        //         var _newstrategy = { ..._strategy.BindingTradeData, sid: _strategy._id }
        //         console.log(_newstrategy);

        //         axios.post(apiUrl + "trade/save", _newstrategy).then(function (res) {
        //             if (res.status == 200) {
        //                 commit(ADDEDITTRADE, _strategy);

        //             }
        //         });
        //     }
        // }
}