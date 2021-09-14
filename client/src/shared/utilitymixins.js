import * as d3 from "d3";


var utilitymixins = {
  data: function () {
    return {
      MARGIN: {
        LEFT: 50,
        RIGHT: 50,
        TOP: 10,
        BOTTOM: 30
      },
      ChartSettings: {
        TOOLTIP: false,
      },
      WIDTH: 500,
      HEIGHT: 300,

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
      var chartData = this.GenerateChartPoint(strategy);
      var paretnId = "#strategy_" + strategy._id + " .chartplaceholder";
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

            if (currentTrade.tradetype == "Future") {
              PnL = currentTrade.buyorsell == "Buy" ? _strikePrice - currentTrade.price : currentTrade.price - _strikePrice;
              netPnL = (currentTrade.quantity * currentTrade.lotsize * PnL);
            } else {
              PnL = currentTrade.buyorsell == "Buy" ? _intrinsicValue - currentTrade.price : currentTrade.price - _intrinsicValue
              netPnL = (currentTrade.quantity * currentTrade.lotsize * PnL);
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
    ///ref: https://gist.github.com/llad/3766585 && http://jsfiddle.net/samselikoff/Jqmzd/2/
    _generateLineChart2: function (chartData, paretnId) {
      if (!chartData || !paretnId)
        return;
      //const lgcolor = "#f0fff0";
      const linecolor = "stroke-current text-yellow-600";

      var xScale, yScale, xAxisCall, yAxisCall;//, xAxisCall2;
      var minPnL = d3.min(chartData, d => d.netPnL);
      var maxPnL = d3.max(chartData, d => d.netPnL);
      var minSP = d3.min(chartData, d => d.strikePrice);
      var maxSP = d3.max(chartData, d => d.strikePrice);


      xScale = d3.scaleLinear().domain([minSP, maxSP]).range([0, this.WIDTH]);
      // xScale = d3.scaleBand().domain(chartData.map(c => c.strikePrice)).range([0, this.WIDTH - this.MARGIN.RIGHT]);
      yScale = d3.scaleLinear()
        .domain([minPnL - 1000, maxPnL + 1000]).nice()
        .range([this.HEIGHT - this.MARGIN.BOTTOM, this.MARGIN.TOP]);
      xAxisCall = d3.axisBottom(xScale);
      yAxisCall = d3.axisLeft(yScale);
      // xAxisCall2 = d3.axisBottom(xScale);

      const svg = d3.select(paretnId).append("svg")
        .attr("class", "line")
        .attr("width", this.WIDTH)
        .attr("height", this.HEIGHT);

      var line = d3
        .line()
        .defined(d => !isNaN(d.netPnL))
        .x(d => xScale(d.strikePrice))
        .y(d => yScale(d.netPnL));

      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + this.MARGIN.LEFT + "," + (this.HEIGHT - this.MARGIN.BOTTOM) + ")")
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
        .selectAll("text")
        .attr("dx", "-5");


      svg.append("g")
        .attr("class", "x axis zero")
        .attr("transform", "translate(" + this.MARGIN.LEFT + "," + yScale(0) + ")")
        .call(xAxisCall.tickSize(0).tickFormat(""));

      svg
        .append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("class", linecolor)
        .attr("stroke-width", 1)
        .attr("transform", "translate(" + this.MARGIN.LEFT + ",0)")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

      if (this.ChartSettings.TOOLTIP) {
        /// 
        /// இன்னும் சில பிரச்னை இருக்கு 
        ///

        const tooltip = svg.append("g");

        const bisect = d3.bisector(d => d.strikePrice).left;
        const callout = (g, value) => {

          if (!value) return g.style("display", "none");

          g.style("display", null)
            .style("pointer-events", "none")
            .style("font", "10px sans-serif");

          const path = g.selectAll("path")
            .data([null])
            .join("path")
            .attr("fill", "white")
            .attr("stroke", "black");

          const text = g.selectAll("text")
            .data([null])
            .join("text")
            .call(text => text
              .selectAll("tspan")
              .data((value + "").split(/\n/))
              .join("tspan")
              .attr("x", 0)
              .attr("y", (d, i) => `${i * 1.1}em`)
              .style("font-weight", (_, i) => i ? null : "bold")
              .text(d => d));

          const { y, width: w, height: h } = text.node().getBBox();

          text.attr("transform", `translate(${-w / 2},${15 - y})`);
          path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
        }

        var _this = this;
        svg.on("touchmove mousemove", function (e) {
          // console.log('this.MARGIN.RIGHT :>> ', _this.MARGIN.LEFT);
          var x0 = xScale.invert(d3.pointer(e)[0]);
          // console.log('x0 :>> ', x0);
          // console.log('typeof(x0) :>> ', typeof(x0));
          // x0 = Number.parseFloat(x0) + 50;
          // console.log('x0 :>> ', x0);
          const index = bisect(chartData, x0, 1);
          const a = chartData[index - 1];
          const b = chartData[index];
          var val = b && (x0 - a.strikePrice > b.strikePrice - x0) ? b : a;
          tooltip
            .attr("transform", `translate(${xScale(x0)},${yScale(val.netPnL)})`)
            .call(callout, `${val.netPnL}\n ${x0}`);

        });
      }











    },





  },

};
export default utilitymixins;


// /// Ref: https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date?page=1&tab=votes#tab-top
// function GetTodayDate() {
//   var d = new Date();
//   var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
//   var mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
//   var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
//   console.log(`${da}-${mo}-${ye}`);
// }