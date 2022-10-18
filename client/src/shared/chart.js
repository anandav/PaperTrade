import * as d3 from "d3";

const utilitymixins = {
  data: function () {
    return {
      MARGIN: {
        LEFT: 50,
        RIGHT: 50,
        TOP: 10,
        BOTTOM: 30,
      },
      ChartSettings: {
        TOOLTIP: true,
        PATTERN: true,
        OFFSET: true,
        TOOLTIPLOCATION: "FOLLOW", //"BOTTOM",//"FOLLOW",//"TOP"
        COLOURS: {
          Line: "stroke-current text-yellow-500 ",
          // XScale: " ",
          // YScale: " ",
          PositiveToolTip: "fill-current text-green-700 opacity-80",
          //PositiveToolTipText: "stroke-current text-black",
          NegativeToolTip: "fill-current text-red-700  opacity-80",
          //NegativeToolTipText: "stroke-current text-white",
          ToolTipDot: "fill-current text-white  opacity-80",
          ToolTipDotInnerGreen: "fill-current text-green-600",
          ToolTipDotInnerRed: "fill-current text-red-600",
          ToolTipLine:
            "stroke-current text-gray-500 dark:text-gray-500 opacity-50",
          PositiveRegion: "fill-current text-green-700 opacity-20 ",
          NegativeRegion: "fill-current text-red-700 opacity-20",
          Positive: "#3DB2FF",
          PositiveRegionOnlyOpacity: "opacity-30",
          Nevgative: "#FF2442",
          NegativeRegionOnlyOpacity: "opacity-30",
          LGGREEN: "rgb(57, 163, 136)",
          LGRED: "rgb(224, 36, 1)",
        },
        DIMENSION: {
          Line: 2,
        },
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
        4: "Equity",
        // 5: "Crypto"
      },
      EXCHANGE: {
        1: "NSE",
        2: "CDS",
        3: "CBOE",
        4: "BSE",
        5: "MCX",
      },
    };
  },
  methods: {
    GenerateChart: function (strategy) {
      let paretnId =
        "#strategy_" + strategy._id + " .chartplaceholder .chart";
      if (this.hasDerivative(strategy)) {
        let chartData = this.GenerateChartPoint(strategy);
        d3.selectAll(paretnId + " > *").remove();
        if (chartData?.length > 0) {
          //this._generateBarChart(chartData, paretnId);
          //this._generateLineChart(chartData, paretnId);
          // console.clear();
          this.GenerateLineChart(chartData, paretnId, strategy);
        } else {
          let placeholder = [
            {
              strikePrice: 1,
              symbol: "Nifty",
              name: "Strategy - 1",
              //"intrinsicValue": 0,
              PnL: 0,
              netPnL: 0,
              qty: 0,
              lot: 0,
              price: 0,
            },
          ];
          this.GenerateLineChart(placeholder, paretnId, strategy);
        }
      }
      else {
        //console.clear();
        //console.log('No Data :>> ');
        strategy.HideChart = false;
        return false;
      }
    },

    GetBreakEven: function (strategy) {
      //let tmaxSP = d3.max(strategy.trades, d => d.selectedstrike);
      let netPnlArr = [];
      for (let i = 0, len = strategy.trades.length; i < len; i++) {
        let currentTrade = strategy.trades[i];
        //let netPnL = 0,          PnL = 0;
        for (let j = 0, len2 = strategy.trades.length; j < len2; j++) {
          let currentTrade2 = strategy.trades[j];
          let obj = this.getNetPnL(currentTrade.selectedstrike, currentTrade2);
          netPnlArr[i] += obj.netPnL;
          //PnL += obj.PnL;
        }
      }
    },

    GetMaxMinPnL: function (strategy) {
      let tminSP = d3.min(strategy.trades, (d) => d.selectedstrike);
      //let tmaxSP = d3.max(strategy.trades, d => d.selectedstrike);
      let minPrice = [tminSP - 1, tminSP];
      let minStriketrade; //strategy.trades.find(t => t.selectedstrike == tminSP);
      //let maxStriketrade = strategy.trades.find(t => t.selectedstrike == tmaxSP);
      let tradeCount = strategy.trades.length;

      minPrice.forEach((j) => {
        for (let i = 0; i < tradeCount; i++) {
          let PnlObj = this.getNetPnL(j, strategy.trades[i]);

          if (minStriketrade) {
            minStriketrade.netPnL += PnlObj.netPnL;
            minStriketrade.PnL = PnlObj.PnL;
          } else {
            minStriketrade = {
              strikePrice: j,
              qty: strategy.trades[i].quantity,
              lot: strategy.trades[i].lotsize,
              price: strategy.trades[i].price,
              ...PnlObj,
            };
          }
        }
      });
    },

    getoffsetprices: function (leastPrice) {
      let _min = Math.min(...leastPrice),
        _max = Math.max(...leastPrice);
      let strikepricemin = this.getdigits(_min, "min"),
        strikepricemax = this.getdigits(_max, "max");
      let incrementby = this.getdigits((_min + _max) / 2, "increment");
      return { x0: strikepricemin, x1: strikepricemax, xstep: incrementby };
    },

    getdigits: function (value, ismin) {
      let _valdiglen = this.ChartSettings.OFFSET
        ? Math.ceil(Math.log10(value + 1))
        : 0;
      let offset = 0;
      let incrementby = 1;
      switch (_valdiglen) {
        case 1:
          offset = 0.05;
          incrementby = 0.01;
          break;
        case 2:
          offset = 1;
          incrementby = 0.01;
          break;
        case 3:
          offset = 10;
          incrementby = 0.1;
          break;
        case 4:
          offset = 100;
          incrementby = 5;
          break;
        case 5:
          offset = value < 20000 ? 500 : 1200;
          incrementby = 10;
          break;
        default:
          offset = 0;
          incrementby = 1;
          break;
      }
      if (ismin == "min") {
        value -= offset;
      } else if (ismin == "max") {
        value += offset;
      } else if (ismin == "increment") {
        value = incrementby;
      }
      return value;
    },

    getAllStrikePrices: function (strategy) {
      let strikePrices = strategy.trades.map((t) => {
        if (t.tradetype == "Future") {
          return t.price;
        } else {
          return t.selectedstrike;
        }
      });
      return strikePrices;
    },

    getNetPnL: function (_strikePrice, currentTrade, strategy) {
      let _intrinsicValue = 0,
        PnL = 0,
        netPnL = 0;

      if (currentTrade.tradetype == "Call") {
        _intrinsicValue =
          _strikePrice - currentTrade.selectedstrike > 0
            ? _strikePrice - currentTrade.selectedstrike
            : 0;
      } else if (currentTrade.tradetype == "Put") {
        _intrinsicValue =
          currentTrade.selectedstrike - _strikePrice > 0
            ? currentTrade.selectedstrike - _strikePrice
            : 0;
      }

      if (currentTrade.tradetype == "Future") {
        PnL =
          currentTrade.buyorsell == "Buy"
            ? _strikePrice - currentTrade.price
            : currentTrade.price - _strikePrice;
        netPnL = currentTrade.quantity * strategy.lotsize * PnL;
      } else {
        PnL =
          currentTrade.buyorsell == "Buy"
            ? _intrinsicValue - currentTrade.price
            : currentTrade.price - _intrinsicValue;
        netPnL = currentTrade.quantity * strategy.lotsize * PnL;
        netPnL = parseFloat(netPnL.toFixed(2));
      }
      return { PnL, netPnL };
    },

    GenerateChartPoint: function (strategy) {
      if (strategy && strategy.trades && strategy.trades.length > 0) {
        let range = {
          x0: parseFloat(strategy.x0),
          x1: parseFloat(strategy.x1),
        };
        let tradeCount = strategy.trades.length;
        let chartData = [];
        let strikePrices = this.getAllStrikePrices(strategy);
        /// Removes undefined from strikePrices
        strikePrices = strikePrices.filter(Boolean);
        let _range = this.getoffsetprices(strikePrices);
        let xStep = _range.xstep;
        range = {
          x0: isNaN(range.x0) ? _range.x0 : range.x0,
          x1: isNaN(range.x1) ? _range.x1 : range.x1,
        };
        for (let i = 0; i < tradeCount; i++) {
          if (!strategy.trades[i].checked) {
            continue;
          }
          let currentTrade = strategy.trades[i];
          if (
            currentTrade.tradetype == "Call" ||
            currentTrade.tradetype == "Put" ||
            currentTrade.tradetype == "Future"
          ) {
            let _strikePrice = range.x0;
            let j = 0;
            do {
              let PnlObj = this.getNetPnL(_strikePrice, currentTrade, strategy);
              if (chartData[j]) {
                chartData[j].netPnL += PnlObj.netPnL;
                chartData[j].PnL = PnlObj.PnL;
              } else {
                chartData.push({
                  strikePrice: parseFloat(_strikePrice.toFixed(2)),
                  qty: currentTrade.quantity,
                  price: currentTrade.price,
                  ...PnlObj,
                });
              }
              j += 1;
              _strikePrice += xStep;
            } while (range.x1 >= _strikePrice);
          }
        }
        return chartData;
      }
    },

    hasDerivative: function (strategy) {
      const s = (e) =>
        e.tradetype == "Call" ||
        e.tradetype == "Put" ||
        e.tradetype == "Future";
      return strategy.trades.some(s);
    },

    /// Line Chart
    /// Ref:  https://observablehq.com/@simulmedia/line-chart
    /// Ref:  https://gist.github.com/llad/3766585
    /// Reg:  http://jsfiddle.net/samselikoff/Jqmzd/2/
    /// Ref:  https://observablehq.com/@elishaterada/simple-area-chart-with-tooltip
    /// Ref:  https://observablehq.com/@jlchmura/d3-change-line-chart-with-positive-negative-fill
    GenerateLineChart: function (chartData, paretnId, strategy) {
      if (!chartData || !paretnId) return;
      const _WIDTH = document.querySelectorAll(paretnId)[0].clientWidth;
      //   const parentObj = document.querySelector(paretnId);
      //  const __node1 =  document.createElement("input")
      //  __node1.setAttribute("class","chart-mini-edit ml-12")
      //parentObj.append(__node1)
      this.WIDTH = _WIDTH > 0 ? _WIDTH : this.WIDTH;
      const minPnL = d3.min(chartData, (d) => d.netPnL);
      const maxPnL = d3.max(chartData, (d) => d.netPnL);
      const minSP = d3.min(chartData, (d) => d.strikePrice);
      const maxSP = d3.max(chartData, (d) => d.strikePrice);

      const xScale = d3
        .scaleLinear()
        .domain([minSP, maxSP])
        .range([this.MARGIN.LEFT, this.WIDTH]);
      const yScale = d3
        .scaleLinear()
        .domain([minPnL, maxPnL])
        .nice()
        .range([this.HEIGHT - this.MARGIN.BOTTOM, this.MARGIN.TOP]);
      const xAxisCall = d3.axisBottom(xScale);
      const yAxisCall = d3
        .axisLeft(yScale)
        .ticks(10)
        .tickFormat(d3.formatPrefix("0.1", 1e5));
      const areaPos = d3
        .area()
        .curve(d3.curveLinear)
        .x((d) => xScale(d.strikePrice))
        .y0(yScale(1))
        .y1((d) => yScale(Math.max(0.1, d.netPnL)));
      const areaNeg = d3
        .area()
        .curve(d3.curveLinear)
        .x((d) => xScale(d.strikePrice))
        .y0(yScale(1))
        .y1((d) => yScale(Math.min(0.1, d.netPnL)));
      const bisect = d3.bisector((d) => d.strikePrice).left;

      const callout = (g, val, xInv) => {
        if (!val) return g.style("display", "none");
        const { height } = g.node().getBBox();
        let pnlval = val.netPnL.toFixed(2);
        let tooltipText = "";
        let transYScale = 0;
        const path = g
          .selectAll("path")
          .data([null])
          .join("path")
          .attr(
            "class",
            val.netPnL > 0
              ? this.ChartSettings.COLOURS.PositiveToolTip
              : this.ChartSettings.COLOURS.NegativeToolTip
          );

        if (this.ChartSettings.TOOLTIPLOCATION == "BOTTOM") {
          tooltip.attr(
            "transform",
            `translate(${xScale(xInv)},${this.HEIGHT - height})`
          );
          tooltipText = `P&L:${pnlval}\nStrike:${xInv}`;
        } else if (this.ChartSettings.TOOLTIPLOCATION == "FOLLOW") {
          transYScale = yScale(pnlval);
          let _transYScale = transYScale;
          if (pnlval < 0) {
            transYScale -= 50;
            _transYScale = transYScale;
            _transYScale = _transYScale < 0 ? _transYScale + 55 : _transYScale;
          } else {
            _transYScale =
              transYScale >= this.HEIGHT - this.MARGIN.BOTTOM
                ? transYScale - 55
                : transYScale;
          }
          tooltip.attr(
            "transform",
            `translate(${xScale(xInv)},${_transYScale})`
          );
          tooltipText = `P&L:${pnlval}\nStrike:${xInv}`;
        } else if (this.ChartSettings.TOOLTIPLOCATION == "TOP") {
          tooltip.attr(
            "transform",
            `translate(${xScale(xInv)},${-height + 35})`
          );
          tooltipText = `P&L:${pnlval}\nStrike:${xInv}`;
        }

        g.style("display", null)
          .style("pointer-events", "none")
          .style("font", "10px sans-serif");
        const text = g
          .selectAll("text")
          .data([null])
          .join("text")
          .call((text) =>
            text
              .selectAll("tspan")
              .data((tooltipText + "").split(/\n/))
              .join("tspan")
              .attr("x", 0)
              .attr("y", (d, i) => `${i * 1.1}em`)
              .style("font-weight", (_, i) => (i ? null : "bold"))
              .style("fill", "white")
              .text((d) => d)
          );
        const { y, width: w, height: h } = text.node().getBBox();
        text.attr("transform", `translate(${-w / 2},${15 - y})`);

        const upArrow = `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h +
          20}h-${w + 20}z`;
        const downArrow = `M ${w / 2 + 10},42 H 5 L 0,47 -5,42 H ${-w / 2 -
          10} v ${h - 60} h ${w + 20}z`;
        if (this.ChartSettings.TOOLTIPLOCATION == "BOTTOM") {
          path.attr("d", upArrow);
        } else if (this.ChartSettings.TOOLTIPLOCATION == "FOLLOW") {
          if (transYScale < 0) {
            path.attr("d", upArrow);
          } else {
            if (transYScale >= this.HEIGHT - this.MARGIN.BOTTOM) {
              path.attr("d", downArrow);
            } else {
              path.attr("d", val.netPnL >= 0 ? upArrow : downArrow);
            }
          }
        } else if (this.ChartSettings.TOOLTIPLOCATION == "TOP") {
          path.attr("d", downArrow);
        }
      };
      const onMouseMove = (e) => {
        const mouse = d3.pointer(e);
        const [x0] = mouse;
        const xInv = parseFloat(xScale.invert(x0).toFixed(2));
        if (
          xScale(xInv) < this.MARGIN.LEFT ||
          xScale(xInv) > this.WIDTH + this.MARGIN.RIGHT
        ) {
          return;
        }
        const xIndex = bisect(chartData, xInv, 1);
        const a = chartData[xIndex - 1];
        const b = chartData[xIndex];
        const val = b && xInv - a.strikePrice > b.strikePrice - xInv ? b : a;

        tooltipline
          .attr("x1", xScale(xInv))
          .attr("y1", this.MARGIN.TOP)
          .attr("x2", xScale(xInv))
          .attr("y2", this.HEIGHT - this.MARGIN.BOTTOM)
          .classed(this.ChartSettings.COLOURS.ToolTipLine, true)
          .attr("stroke-dasharray", "10,2");

        tooltipdot
          .attr("cx", xScale(xInv))
          .attr("cy", yScale(val.netPnL))
          .attr("r", "4")
          .classed(this.ChartSettings.COLOURS.ToolTipDot, true);

        tooltipdotinner
          .attr("cx", xScale(xInv))
          .attr("cy", yScale(val.netPnL))
          .attr("r", "6")
          .classed(this.ChartSettings.COLOURS.ToolTipDotInnerGreen, false)
          .classed(this.ChartSettings.COLOURS.ToolTipDotInnerRed, false)
          .classed(
            val.netPnL >= 0
              ? this.ChartSettings.COLOURS.ToolTipDotInnerGreen
              : this.ChartSettings.COLOURS.ToolTipDotInnerRed,
            true
          );

        tooltip.call(callout, val, xInv);
      };
      const onMouseLeave = () => {
        svg
          .selectAll(".hovertooltip, .hoverline, .hoverdot")
          .attr("visibility", "hidden");
      };
      const onMouseEnter = () => {
        svg
          .selectAll(".hovertooltip, .hoverline, .hoverdot")
          .attr("visibility", "visible");
      };
      const svg = d3
        .select(paretnId)
        .append("svg")
        .attr("class", "line")
        .attr("width", this.WIDTH)
        .attr("height", this.HEIGHT);

      const line = d3
        .line()
        .defined((d) => !isNaN(d.netPnL))
        .x((d) => xScale(d.strikePrice))
        .y((d) => yScale(d.netPnL));

      const lgdefID = `lg_${strategy._id}`;
      const lgurlid = `url(#${lgdefID})`;

      svg.attr("stroke-width", this.ChartSettings.DIMENSION.Line);

      svg
        .append("linearGradient")
        .attr("id", lgdefID)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("x2", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
        .selectAll("stop")
        .data(chartData)
        .join("stop")
        .attr("offset", (d) => {
          return (
            xScale(d.strikePrice) /
            (this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
          );
        })
        .attr("stop-color", (d) => {
          return d.netPnL >= 0
            ? this.ChartSettings.COLOURS.LGGREEN
            : this.ChartSettings.COLOURS.LGRED;
        });

      svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(${this.MARGIN.LEFT}, 0)`)
        .call(yAxisCall)
        .selectAll("text")
        .attr("dx", "-5");

      // svg.append("g")
      //   .attr("class", "x axis zero")
      //   .attr("stroke", "#fff")
      //   .attr("transform", `translate(0, ${yScale(0)})`)
      //   .call(xAxisCall.tickSize(0).tickFormat(""));

      const yDomain = yScale.domain();
      if ((yDomain[0] <= 0 && 0 <= yDomain[1]) || yDomain[0] == yDomain[1]) {
        svg
          .append("g")
          .attr("class", "x axis zero")
          .attr("transform", `translate(0, ${yScale(0)})`)
          .call(xAxisCall)
          .selectAll("text")
          .style("text-anchor", "begin")
          .attr("dx", "2em")
          .attr("dy", "0em")
          .attr("transform", "rotate(40)");
      } else {
        svg
          .append("g")
          .attr("class", "x axis")
          .attr(
            "transform",
            `translate(0, ${this.HEIGHT - this.MARGIN.BOTTOM})`
          )
          .call(xAxisCall)
          .selectAll("text")
          .style("text-anchor", "begin")
          .attr("dx", "2em")
          .attr("dy", "0em")
          .attr("transform", "rotate(40)");
      }

      svg
        .append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("stroke", lgurlid)
        .attr("stroke-width", this.ChartSettings.DIMENSION.Line)
        .attr("transform", "translate(0,0)")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

      if (this.ChartSettings.PATTERN) {
        svg
          .append("defs")
          .append("pattern")
          .attr("id", "green")
          .attr("patternUnits", "userSpaceOnUse")
          .attr("width", 4)
          .attr("height", 4)
          .append("path")
          .attr("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
          .attr("stroke", this.ChartSettings.COLOURS.Positive)
          .attr("stroke-width", 1);

        svg
          .append("defs")
          .append("pattern")
          .attr("id", "saffron")
          .attr("patternUnits", "userSpaceOnUse")
          .attr("width", 4)
          .attr("height", 4)
          .append("path")
          .attr("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
          .attr("stroke", this.ChartSettings.COLOURS.Nevgative)
          .attr("stroke-width", 1);

        svg
          .append("path")
          .datum(chartData)
          .attr("fill", "url(#green)")
          .attr("class", this.ChartSettings.COLOURS.PositiveRegionOnlyOpacity)
          .attr("d", areaPos);

        svg
          .append("path")
          .datum(chartData)
          .attr("fill", "url(#saffron)")
          .attr("class", this.ChartSettings.COLOURS.NegativeRegionOnlyOpacity)
          .attr("d", areaNeg);
      } else {
        svg
          .append("path")
          .datum(chartData)
          .attr("class", this.ChartSettings.COLOURS.PositiveRegion)
          .attr("d", areaPos);

        svg
          .append("path")
          .datum(chartData)
          .attr("class", this.ChartSettings.COLOURS.NegativeRegion)
          .attr("d", areaNeg);
      }
      const tooltipline = svg.append("line").classed("hoverline", true);
      const tooltipdotinner = svg.append("circle").classed("hoverdot", true);
      const tooltipdot = svg.append("circle").classed("hoverdot", true);
      const tooltip = svg.append("g").classed("hovertooltip", true);
      if (this.ChartSettings.TOOLTIP) {
        svg.on("mousemove", onMouseMove);
        svg.on("mouseleave", onMouseLeave);
        svg.on("mouseenter", onMouseEnter);
      }
    },
  },
};
export default utilitymixins;
