import "dotenv/config";
const axios = require("axios");
const apiUrl = process.env.VUE_APP_APIURL || "/";

import {
  GETALLPORTFOLIOS,
  SETPORTFOLIO,
  DELETEPORTFOLIE,
} from "./mutationtype";


const actions = {
  async GetAllPortfolios({ commit }) {
    const response = await axios.get(apiUrl + "portfolio");
    commit(GETALLPORTFOLIOS, response.data);
  },
  SelectPortfolioChanged({ commit }, _protfolio) {
    commit(SETPORTFOLIO, _protfolio);
  },

  async GetPortfolioById({ commit }, item) {
    axios.post(apiUrl + "portfolio/find", {
      "fieldName": "_id",
      "fieldValue": item._id,
    }).then(function (res) {
      commit(SETPORTFOLIO, res.data[0]);
    });
  },
  async SavePortfolio({ commit }, item) {
    axios.post(apiUrl + "portfolio/save", {
      "_id": item._id,
      "name": item.name,
      "description": item.description,
      "updateui": item.updateui,
    }).then(function (res) {
      if (item.updateui) {
        commit(GETALLPORTFOLIOS, res.data);
      } else {
        commit(SETPORTFOLIO, res.data[0])
      }
    }).catch(e => { console.log(e); });
  },
  async DeletePortfolio({ commit }, item) {
    console.log("Porfolio Delete Action called")

    axios.post(apiUrl + "portfolio/delete", item)
      .then(function () {
        console.log("Porfolio Delete callback called")
        commit(DELETEPORTFOLIE, item);
      });


  }
};
export default actions;