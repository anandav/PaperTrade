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
    //console.log('strategyObject :>> ', strategyObject);
    return strategyObject;
  },
  GetTradeById: async function (id) {
    var tradeObject = await Strategy.findOne({
      "trades._id": id,
    });
    return tradeObject;
  },

  DeleteStrategyUsingPortfolioID: function(pid) {
    if (pid) {
      Strategy.remove({ portfolio: pid }, (err, doc) => {
        return doc;
      });
    }
  },
  
};
