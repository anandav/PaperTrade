const Portfolio = require("./portfolio");
const Strategy = require("./strategy");

const activeFilter = { isactive: { $ne: false } };

module.exports = {
  activeFilter,

  GetPortfolioById: async function (id, userId) {
    var profolioObject = await Portfolio.findOne({
      _id: id,
      userId: userId,
      ...activeFilter,
    });
    return profolioObject;
  },

  GetStrategyById: async function (id, userId) {
    var strategyObject = await Strategy.findOne({
      _id: id,
      userId: userId,
      ...activeFilter,
    });
    return strategyObject;
  },
  GetTradeById: async function (id, userId) {
    var tradeObject = await Strategy.findOne({
      "trades._id": id,
      userId: userId,
      ...activeFilter,
    });
    return tradeObject;
  },

  DeactivateStrategyUsingPortfolioID: async function (pid, userId) {
    if (!pid) {
      return null;
    }
    if (global.appConfig && global.appConfig.enableDemo) {
      return null;
    }
    const filter = {
      portfolio: pid,
      ...activeFilter,
    };
    if (userId) {
      filter.userId = userId;
    }
    return Strategy.updateMany(filter, {
      $set: { isactive: false, modifiedon: new Date() },
    });
  },

  DeleteStrategyUsingPortfolioID: async function (pid, userId) {
    return this.DeactivateStrategyUsingPortfolioID(pid, userId);
  },
};
