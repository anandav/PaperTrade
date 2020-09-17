const { ObjectID } = require("mongodb");
const Portfolio = require("./portfolio");
const trade = require("./trade");
module.exports = {
  GetPortfolioById: async function (id) {
    var profolioObject = await Portfolio.findOne({ _id: id });
    return profolioObject;
  },

  GetStartegyById: async function (id) {
    var strategyObject = await Portfolio.findOne({
      "Strategies._id": id,
    });
    return strategyObject;
  },
  GetTradeById: async function (id) {
    var tradeObject = await Profolio.findOne({
      "Strategies.Trades._id": id,
    });
    return tradeObject;
  },
};
