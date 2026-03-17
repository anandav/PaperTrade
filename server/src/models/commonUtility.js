const { ObjectID } = require("mongodb");
const Portfolio = require("./portfolio");
const Strategy = require("./strategy");
const trade = require("./trade");
module.exports = {
  GetPortfolioById: async function (id, userId) {
    var profolioObject = await Portfolio.findOne({ _id: id, userId: userId });
    return profolioObject;
  },

  GetStrategyById: async function (id, userId) {
    var strategyObject = await Strategy.findOne({
      _id: id,
      userId: userId
    });
    return strategyObject;
  },
  GetTradeById: async function (id, userId) {
    var tradeObject = await Strategy.findOne({
      "trades._id": id,
      userId: userId
    });
    return tradeObject;
  },

  DeleteStrategyUsingPortfolioID: function (pid, userId) {
    if (pid) {
      if (!(global.appConfig && global.appConfig.enableDemo)) {
        Strategy.deleteMany({ portfolio: pid, userId: userId }, (err, doc) => {
          return doc;
        });
      }
      else
      {
        return null;
      }
     
    }
  },

};
