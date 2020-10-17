const { ObjectID } = require("mongodb");
const Portfolio = require("./portfolio");
const Strategy = require("./strategy");
const trade = require("./trade");
module.exports = {
  GetPortfolioById: async function (id) {
    var profolioObject = await Portfolio.findOne({ _id: id });
    return profolioObject;
  },

  GetStrategyById: async function (id) {
    var strategyObject = await Strategy.findOne({
      _id: id,
    });
    return strategyObject;
  },
  GetTradeById: async function (id) {
    var tradeObject = await Strategy.findOne({
      "trades._id": id,
    });
    return tradeObject;
  },
};
