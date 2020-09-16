const Portfolio = require("./portfolio");
module.exports = {
  GetPortfolioById: async function (id) {
    var profolioObject = await Portfolio.findOne({ _id: id });
    return profolioObject;
  },

  GetStartegyFromPorfolioById: async function (portfolioID, startegyID) {
    var portfolioObject = await this.GetPortfolioById(portfolioID);
    var strategyObject = await portfolioObject.find({
      "Startegies._id": startegyID,
    });
    console.log("strategyObject :>> ", strategyObject);
    return strategyObject;
  },
};
