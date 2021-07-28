const axios = require("axios");
import {
    GETALLPORTFOLIOS,
    SETPORTFOLIO,
  } from "./mutationtype";

  
const actions = {
    async GetAllPortfolios({ commit }) {
      const response = await axios.get(process.env.VUE_APP_APIURL + "/portfolio");
      commit(GETALLPORTFOLIOS, response.data);
    },
    SelectPortfolioChanged({ commit }, _protfolio) {
      commit(SETPORTFOLIO, _protfolio);
    },
  
    async GetPortfolioById({ commit }, item) {
      
      axios.post(process.env.VUE_APP_APIURL + "/portfolio/find", {
        "fieldName": "_id",
        "fieldValue": item._id,
      }).then(function (res) {
        commit(SETPORTFOLIO, res.data[0]);
      });
    },
    async SavePortfolio({ commit }, item) {
      console.log("Portfolio function calledl.");
      console.log(item);
      axios.post(process.env.VUE_APP_APIURL + "/portfolio/save", {
        "pid": item.pid,
        "name": item.name,
        "description": item.description,
        "getallportfolio": item.getallportfolio,
      }).then(function (res) {
        console.log("Save Portfoli reuslt in res.data");
        console.log(res.data);
        if (item.GetAllPortfolios) {
          commit(GETALLPORTFOLIOS, res.data);
        }else{
          console.log(res.data[0]);
          commit(SETPORTFOLIO,res.data[0])
        }
  
      });
  
    },
  };
  export default actions;