import * as d3 from "d3";


var utilitymixins = {
  data: function () {
    return {
      MARGIN: {
        LEFT: 50,
        RIGHT: 50,
        TOP: 15,
        BOTTOM: 35
      },
      WIDTH: 450,
      HEIGHT: 250,

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
  },
  methods: {
    GenerateChart: function (strategy) {
      //console.clear();
      var chartData = this.GenerateChartPoint(strategy);
      var paretnId = "#strategy_" + strategy._id + " .chartplaceholder";
      console.log('chartData :>> ', chartData);
      d3.selectAll(paretnId + " > *").remove();
      //this._generateBarChart(chartData, paretnId);
      //this._generateLineChart(chartData, paretnId);
      this._generateLineChart2(chartData, paretnId);

    },

    GenerateChartPoint: function (strategy) {

      if (strategy && strategy.trades && strategy.trades.length > 0) {
        var tradeCount = strategy.trades.length;
        var chartData = [];
        //console.clear();
        for (let i = 0; i < tradeCount; i++) {
          let currentTrade = strategy.trades[i];
          //console.log(JSON.stringify(currentTrade));
          let _strikePrice = currentTrade.strikepricemin;
          var _intrinsicValue = 0, PnL = 0, netPnL = 0;

          // currentTrade.strikepricestep = 1;

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
            j += 1;
            _strikePrice += currentTrade.strikepricestep;
          }
          while (currentTrade.strikepricemax >= _strikePrice)
        }
        //console.log(chartData);
        return chartData;
      }
    },

    // POC: BarChart
    _generateBarChart: function (chartData, paretnId) {
      console.log('chartData :>> ', chartData);
      var _numbers = chartData.map(c => c.netPnL);
      var _max = Math.max(..._numbers) + 2000;
      var _min = Math.min(..._numbers) - 1000;
      const svg = d3.select(paretnId).append("svg")
        .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
        .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM);
      const g = svg.append("g")
        .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.BOTTOM})`);

      const rect = g.selectAll("rect").data(chartData);
      const x = d3.scaleBand().domain(chartData.map(c => c.strikePrice)).range([0, this.WIDTH]);//.paddingInner(0).paddingOuter(0.5);
      //const y = d3.scaleLinear().domain([_min, _max]).range([0, this.HEIGHT]);/// Changing min & max to start chart from bottom
      const y = d3.scaleLinear().domain([_max, _min]).range([0, this.HEIGHT]);

      const xAxisCall = d3.axisBottom(x);
      const yAxisCall = d3.axisLeft(y);

      g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${this.HEIGHT})`)
        .call(xAxisCall);
      g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);

      rect.enter().append("rect")
        .attr("x", (d) => x(d.strikePrice))
        .attr("y", (d) => y(d.netPnL))
        .attr("width", 30)
        .attr("height", (d) => this.HEIGHT - y(d.netPnL))
        .attr("fill", "#ffc107");
    },

    // POC: Line Chart
    ///Ref: https://observablehq.com/@d3/line-chart
    _generateLineChart: function (chartData, paretnId) {
      console.log('chartData :>> ', chartData);
      const line = d3.line()
        .defined(d => !isNaN(d.netPnL))
        .x(d => x(d.strikePrice))
        .y(d => y(d.netPnL))
      // const x = d3.scaleBand()
      //   .domain(chartData.map(c => c.strikePrice))
      //   .range([this.MARGIN.LEFT, this.WIDTH - this.MARGIN.RIGHT])
      const x = d3.scaleBand().domain(chartData.map(c => c.strikePrice)).range([0, this.WIDTH - this.MARGIN.RIGHT]);

      const y = d3.scaleLinear()
        .domain([d3.min(chartData, d => d.netPnL) - 1000, d3.max(chartData, d => d.netPnL) + 1000]).nice()
        .range([this.HEIGHT - this.MARGIN.BOTTOM, this.MARGIN.TOP])

      const xAxis = g => g
        .attr("transform", `translate(0,${this.HEIGHT - this.MARGIN.BOTTOM})`)
        .call(d3.axisBottom(x).ticks(this.WIDTH / 80).tickSizeOuter(0))
      const yAxis = g => g
        .attr("transform", `translate(${this.MARGIN.LEFT},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(chartData.y))

      const svg = d3.select(paretnId).append("svg")
        .attr("viewBox", [0, 0, this.WIDTH, this.HEIGHT]);

      svg.append("g")
        .call(xAxis);

      svg.append("g")
        .call(yAxis);

      svg.append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("stroke", "#ffc107")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
    },

    ///POC : Line Chart
    ///ref: https://observablehq.com/@simulmedia/line-chart
    _generateLineChart2: function (chartData, paretnId) {
      if (!chartData || !paretnId)
        return;
      //const color = "#f0fff0";
      const linecolor = "stroke-current text-yellow-600";
      var x, y, xAxisCall, yAxisCall;
      x = d3.scaleBand().domain(chartData.map(c => c.strikePrice)).range([0, this.WIDTH - this.MARGIN.RIGHT]);
      y = d3.scaleLinear()
        .domain([d3.min(chartData, d => d.netPnL) - 1000, d3.max(chartData, d => d.netPnL) + 1000]).nice()
        .range([this.HEIGHT - this.MARGIN.BOTTOM, this.MARGIN.TOP]);
      xAxisCall = d3.axisBottom(x);
      yAxisCall = d3.axisLeft(y);

      const svg = d3.select(paretnId).append("svg")
        .attr("class", "line")
        .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
        .attr("height", this.HEIGHT);

      var line = d3
        .line()
        .defined(d => !isNaN(d.netPnL))
        .x(d => x(d.strikePrice))
        .y(d => y(d.netPnL));

      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + this.MARGIN.LEFT + "," + (this.HEIGHT - this.MARGIN.BOTTOM) + ")")
        //.attr("transform", "translate(" + this.MARGIN.LEFT + "," + (this.HEIGHT) / 2 + ")")
        .call(xAxisCall)
        .selectAll("text")
        .style("text-anchor", "begin")
        .attr("dx", "2em")
        .attr("dy", "0em")
        .attr("transform", "rotate(40)");
      svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + this.MARGIN.LEFT + ", 0)")
        .call(yAxisCall)
        //.call(yAxisCall2)
        .selectAll("text")
        .attr("dx", "-5");
      svg
        .append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("class", linecolor)
        .attr("stroke-width", 2)
        .attr("transform", "translate(" + this.MARGIN.LEFT + ",0)")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
    },


    GetTodayDate: function () {
      /// Ref: https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date?page=1&tab=votes#tab-top
      var d = new Date();
      var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
      var mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
      var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
      console.log(`${da}-${mo}-${ye}`);
    }


  },

};
export default utilitymixins;
