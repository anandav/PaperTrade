const axios = require("axios");
import {
  GETALLPORTFOLIOS,
  SETPORTFOLIO,
  DELETEPORTFOLIE,
} from "./mutationtype";


const actions = {
  async GetAllPortfolios({ commit }) {
    const response = await axios.get("/portfolio");
    commit(GETALLPORTFOLIOS, response.data);
  },
  SelectPortfolioChanged({ commit }, _protfolio) {
    commit(SETPORTFOLIO, _protfolio);
  },

  async GetPortfolioById({ commit }, item) {
    axios.post("/portfolio/find", {
      "fieldName": "_id",
      "fieldValue": item._id,
    }).then(function (res) {
      commit(SETPORTFOLIO, res.data[0]);
    });
  },
  async SavePortfolio({ commit }, item) {
    axios.post("/portfolio/save", {
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

    });
  },
  async DeletePortfolio({ commit }, item) {

    console.log("Porfolio Delete Action called")

    axios.post("/portfolio/delete", item)
      .then(function () {
        console.log("Porfolio Delete callback called")
        commit(DELETEPORTFOLIE, item);
      });


  }
};
export default actions;