var utilitymixins = {
  methods: {
    GenerateChartPoint: function (strategy, todyaSpotPrice) {
      if (strategy && strategy.trades && strategy.trades.length) {
        var tradeCount = strategy.trades.length;
        var _spotPrice = strategy.spotprice;
        for (let i = 0; i < tradeCount; i++) {
          let currentTrade = strategy.trades[i];
          let _strikeprice = currentTrade.strikepricemin;

          var _intrinsicValue = 0, PnL = 0, netPnL = 0;
          do {

            if (currentTrade.tradetype == "Call") {

              _intrinsicValue = _strikeprice - todyaSpotPrice > 0 ? 0 : _strikeprice - todyaSpotPrice;
              PnL = currentTrade.buyorsell == "Buy" ? _intrinsicValue - currentTrade.spotprice : currentTrade.spotprice - _intrinsicValue
              netPnL = (currentTrade.quantity * currentTrade.lotsize * PnL)
              console.log({ 'strikeprice': _strikeprice, "intrinsicValue": _intrinsicValue, "NetPnL": netPnL });
            }
            else if (currentTrade.tradetype == "Put") {
              console.log("put");
            }
            _strikeprice += currentTrade.strikepricestep;
          }
          while (currentTrade.strikepricemax >= _strikeprice)
        }

      }
    },
    GetTodayDate: function () {
      /// Ref: https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date?page=1&tab=votes#tab-top
      var d = new Date();
      var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
      var mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
      var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
      console.log(`${da}-${mo}-${ye}`);
    }

    // conflicting: function () {
    //   console.log("from mixin");
    // },
    // ThisWeekExpiryDate: function () {
    //   var fromDate = new Date();
    //   var daystoNextThursday = (4 - fromDate.getDay()) % 7;
    //   if (daystoNextThursday < 0) {
    //     daystoNextThursday = daystoNextThursday + 7;
    //   }
    //   fromDate.setDate(fromDate.getDate() + daystoNextThursday);
    //   return fromDate;
    // },
    // NextWeekExpiryDate: function () {
    //   var nextExpryDate = this.ThisWeekExpiryDate();
    //   nextExpryDate.setDate(nextExpryDate.getDate() + 7);
    //   return nextExpryDate();
    // }
  },
  data: function () {
    return {
      BUYORSELL: {
        1: "Buy",
        2: "Sell",
      },
      TRADETYPE: {
        1: "Call",
        2: "Put",
        3: "Future",
        // 4:"Stocks",
      },
      EXCHANGE: {
        1: "NSE",
        4: "CDS",
        3: "BSE",
        5: "MCX",
        2: "CBOE",
      }
    }
  }
};
export default utilitymixins;
