const axios = require("axios").default;
const jmespath = require("jmespath");

require("dotenv/config");
let lastupdated = null;
let symbolList = null;

module.exports = {
  Maps: {
    getAllTradeType: "trades[?!isexit].tradetype",
  },
  Get: async function (portfolio, startegy, action) {
    if (action == "init") {
      if (!lastupdated) {
        lastupdated = new Date();
      } else {
        lastupdated = new Date(lastupdated);
      }
      let now = Date.now();
      let totalHourDiff = Math.abs(now - lastupdated) / 36e5;
      if (!symbolList || totalHourDiff > 24) {
        let _inputData = await this.GetSymbolBook();
        symbolList = this.getObject(_inputData, "data[*]");
        return symbolList;
      } else {
        console.log(
          "Loading from memory Dataset :>> last updated ",
          lastupdated,
          " Total Hours: ",
          totalHourDiff
        );
      }
    }
  },
  GetSymbolBook: async function () {
    const url = process.env.CBOE_LIST_API;
    return this.getData(url);
  },
  getObject: function (inputData, selector) {
    return jmespath.search(inputData, selector);
  },
  getData: async function (url) {
    ///Ref: https://stackoverflow.com/questions/67864408/how-to-return-server-response-from-axios
    try {
      const responce = await axios.get(url);
      return responce.data;
    } catch (e) {
      return null;
      //return e.reponce.data
    }
  },
};
