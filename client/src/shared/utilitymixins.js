var utilitymixins = {
  methods: {
    GenerateChartPoint: function (strategy) {
      if (strategy && strategy.trades && strategy.trades.length > 0) {
        var tradeCount = strategy.trades.length;
        var chartData = [];
        for (let i = 0; i < tradeCount; i++) {
          let currentTrade = strategy.trades[i];
          let _strikePrice = currentTrade.strikepricemin;
          var _intrinsicValue = 0, PnL = 0, netPnL = 0;
          // if (true) {
          //   ///have to pass a parameter from u
          //   _strikePrice = currentTrade.strikepricemin - (currentTrade.strikepricestep - currentTrade.price);
          //   console.log('_strikePrice :>> ', _strikePrice);
          // }

          let j = 0;
          do {

            if (currentTrade.tradetype == "Call") {
              _intrinsicValue = _strikePrice - currentTrade.selectedstrike > 0 ? _strikePrice - currentTrade.selectedstrike : 0;
            }
            else if (currentTrade.tradetype == "Put") {
              _intrinsicValue = currentTrade.selectedstrike - _strikePrice > 0 ? currentTrade.selectedstrike - _strikePrice : 0;
            }
            PnL = currentTrade.buyorsell == "Buy" ? _intrinsicValue - currentTrade.price : currentTrade.price - _intrinsicValue
            netPnL = (currentTrade.quantity * currentTrade.lotsize * PnL);

if(i== 3){

}

            if (chartData[j]) {
              chartData[j].netPnL += netPnL;
              chartData[j].PnL = PnL;
            } else {
              chartData.push({
                "strikePrice": _strikePrice,
                "intrinsicValue": _intrinsicValue,
                "PnL": PnL,
                "netPnL": netPnL,
                "qty": currentTrade.quantity,
                "lot": currentTrade.lotsize,
                "price": currentTrade.price
              });
            }

            if(i== 3){
              console.log('_strikePrice, netPnL, _intrinsicValue :>> ', _strikePrice, netPnL, _intrinsicValue);

            }

            j += 1;
            _strikePrice += currentTrade.strikepricestep;
          }
          while (currentTrade.strikepricemax >= _strikePrice)
        }
        console.log(chartData);
        return chartData;
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
