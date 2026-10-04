import * as d3 from "d3";
//import logs, { log } from "../common/logs"
const utilitymixins = {
  data: function () {
    return {
      MARGIN: {
        LEFT: 50,
        RIGHT: 50,
        TOP: 30,
        BOTTOM: 38,
      },
      ChartSettings: {
        TOOLTIP: true,
        PATTERN: false,
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
          Positive: "#39A388",
          PositiveRegionOnlyOpacity: "opacity-30",
          Negative: "#E02401",
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
    };
  },
  methods: {
    GenerateChart: function (strategy) {
      let paretnId =
        "#strategy_" + strategy._id + " .chartplaceholder .chart";
      const chartNode = document.querySelector(paretnId);
      if (!chartNode) {
        return false;
      }
      d3.selectAll(paretnId + " > *").remove();
      if (!this.hasDerivative(strategy)) {
        return false;
      }
      let chartData = this.GenerateChartPoint(strategy);
      if (chartData?.length > 0) {
        this.GenerateLineChart(paretnId, strategy, chartData);
        return true;
      }
      return false;
    },

    GetPayoffSummary: function (chartData) {
      if (!chartData || !chartData.length) {
        return null;
      }
      let maxPoint = chartData[0];
      let minPoint = chartData[0];
      for (const d of chartData) {
        if (d.netPnL > maxPoint.netPnL) maxPoint = d;
        if (d.netPnL < minPoint.netPnL) minPoint = d;
      }
      let breakevens = [];
      for (let i = 1; i < chartData.length; i++) {
        const prev = chartData[i - 1];
        const curr = chartData[i];
        if (prev.netPnL === 0) {
          breakevens.push(prev.strikePrice);
        } else if (
          (prev.netPnL < 0 && curr.netPnL > 0) ||
          (prev.netPnL > 0 && curr.netPnL < 0)
        ) {
          const ratio = -prev.netPnL / (curr.netPnL - prev.netPnL);
          breakevens.push(
            parseFloat(
              (
                prev.strikePrice +
                ratio * (curr.strikePrice - prev.strikePrice)
              ).toFixed(2)
            )
          );
        }
      }
      const last = chartData[chartData.length - 1];
      if (last.netPnL === 0) {
        breakevens.push(last.strikePrice);
      }
      return { maxProfit: maxPoint, maxLoss: minPoint, breakevens };
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

    GenerateChartPoint: function (strategy, skipExit ) {
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
          
          if(currentTrade.isexit && skipExit){
            continue;
          }

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
      if (!strategy || !Array.isArray(strategy.trades) || !strategy.trades.length) {
        return false;
      }
      return strategy.trades.some(
        (e) =>
          e.tradetype == "Call" ||
          e.tradetype == "Put" ||
          e.tradetype == "Future"
      );
    },

    hasTrades: function (strategy) {
      return !!(strategy && Array.isArray(strategy.trades) && strategy.trades.length);
    },

    effectiveLotSize: function (strategy) {
      if (strategy && strategy.symboltype == "Equity") {
        return 1;
      }
      return strategy ? strategy.lotsize : 1;
    },

    /// Line Chart
    /// Ref:  https://observablehq.com/@simulmedia/line-chart
    /// Ref:  https://gist.github.com/llad/3766585
    /// Reg:  http://jsfiddle.net/samselikoff/Jqmzd/2/
    /// Ref:  https://observablehq.com/@elishaterada/simple-area-chart-with-tooltip
    /// Ref:  https://observablehq.com/@jlchmura/d3-change-line-chart-with-positive-negative-fill
    GenerateLineChart: function (paretnId, strategy, chartData) {
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
      const xAxisCall = d3
        .axisBottom(xScale)
        .ticks(Math.max(4, Math.floor(this.WIDTH / 90)));
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
          tooltipText = `P&L: ${pnlval}\nStrike: ${xInv}`;
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
          tooltipText = `P&L: ${pnlval}\nStrike: ${xInv}`;
        } else if (this.ChartSettings.TOOLTIPLOCATION == "TOP") {
          tooltip.attr(
            "transform",
            `translate(${xScale(xInv)},${-height + 35})`
          );
          tooltipText = `P&L: ${pnlval}\nStrike: ${xInv}`;
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
      //const lgdefIDexit = `lgexit_${strategy._id}`;
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

      // svg
      //   .append("linearGradient")
      //   .attr("id", lgdefIDexit)
      //   .attr("gradientUnits", "userSpaceOnUse")
      //   .attr("x1", 0)
      //   .attr("x2", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      //   .selectAll("stop")
      //   .data(chartDatawithoutExit)
      //   .join("stop")
      //   .attr("offset", (d) => {
      //     return (
      //       xScale(d.strikePrice) /
      //       (this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      //     );
      //   })
      //   .attr("stop-color", (d) => {
      //     console.log("d.netPnL2");
      //     console.log(d.netPnL);
      //     return d.netPnL >= 0
      //       ? this.ChartSettings.COLOURS.LGGREEN
      //       : this.ChartSettings.COLOURS.LGRED;
      //   });

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

        // svg
        // .append("path")
        // .datum(chartDatawithoutExit)
        // .attr("fill", "none")
        // .attr("stroke", lgurlid)
        // .attr("stroke-width", this.ChartSettings.DIMENSION.Line)
        // .attr("transform", "translate(0,0)")
        // .attr("stroke-linejoin", "round")
        // .attr("stroke-linecap", "round")
        // .attr("d", line);
  



      if (this.ChartSettings.PATTERN) {
        const greenPatternId = `green_${strategy._id}`;
        const saffronPatternId = `saffron_${strategy._id}`;
        const defs = svg.append("defs");

        defs
          .append("pattern")
          .attr("id", greenPatternId)
          .attr("patternUnits", "userSpaceOnUse")
          .attr("width", 4)
          .attr("height", 4)
          .append("path")
          .attr("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
          .attr("stroke", this.ChartSettings.COLOURS.Positive)
          .attr("stroke-width", 1);

        defs
          .append("pattern")
          .attr("id", saffronPatternId)
          .attr("patternUnits", "userSpaceOnUse")
          .attr("width", 4)
          .attr("height", 4)
          .append("path")
          .attr("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
          .attr("stroke", this.ChartSettings.COLOURS.Negative)
          .attr("stroke-width", 1);

        svg
          .append("path")
          .datum(chartData)
          .attr("fill", `url(#${greenPatternId})`)
          .attr("class", this.ChartSettings.COLOURS.PositiveRegionOnlyOpacity)
          .attr("d", areaPos);

        svg
          .append("path")
          .datum(chartData)
          .attr("fill", `url(#${saffronPatternId})`)
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

      this.DrawPayoffAnnotations(svg, xScale, yScale, chartData);

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

    DrawPayoffAnnotations: function (svg, xScale, yScale, chartData) {
      const summary = this.GetPayoffSummary(chartData);
      if (!summary) return;

      const tag = (parent, x, y, label, fill, anchor, baseline) => {
        const group = parent
          .append("g")
          .attr("class", "payoff-tag")
          .style("pointer-events", "none");
        const text = group
          .append("text")
          .attr("x", x)
          .attr("y", y)
          .attr("text-anchor", anchor)
          .attr("dominant-baseline", baseline)
          .style("font", "12px sans-serif")
          .style("font-weight", "700")
          .attr("fill", "white")
          .text(label);
        const { x: bx, y: by, width, height } = text.node().getBBox();
        group
          .insert("rect", "text")
          .attr("x", bx - 5)
          .attr("y", by - 3)
          .attr("width", width + 10)
          .attr("height", height + 6)
          .attr("rx", 4)
          .attr("fill", fill)
          .attr("opacity", 0.95);
        return group;
      };

      const annotations = svg.append("g").attr("class", "payoff-annotations");

      const edgeAnchor = (x) => {
        if (x < this.MARGIN.LEFT + 45) return "start";
        if (x > this.WIDTH - 45) return "end";
        return "middle";
      };

      summary.breakevens.forEach((be) => {
        const x = xScale(be);
        annotations
          .append("line")
          .attr("x1", x)
          .attr("x2", x)
          .attr("y1", this.MARGIN.TOP)
          .attr("y2", this.HEIGHT - this.MARGIN.BOTTOM)
          .attr("stroke", "currentColor")
          .attr("class", "text-gray-400 dark:text-gray-500")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "3,3")
          .attr("opacity", 0.6);

        tag(
          annotations,
          x,
          this.MARGIN.TOP - 16,
          `BE ${be}`,
          "#4B5563",
          edgeAnchor(x),
          "hanging"
        );
      });

      if (summary.maxProfit.netPnL === summary.maxLoss.netPnL) return;

      [
        { point: summary.maxProfit, label: "Max profit", fill: this.ChartSettings.COLOURS.Positive, above: true },
        { point: summary.maxLoss, label: "Max loss", fill: this.ChartSettings.COLOURS.Negative, above: false },
      ].forEach(({ point, label, fill, above }) => {
        const x = xScale(point.strikePrice);
        const y = yScale(point.netPnL);

        annotations
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 3.5)
          .attr("fill", fill)
          .attr("stroke", "white")
          .attr("stroke-width", 1);

        const placeAbove = above
          ? y > this.MARGIN.TOP + 22
          : y > this.HEIGHT - this.MARGIN.BOTTOM - 22;

        tag(
          annotations,
          x,
          placeAbove ? y - 11 : y + 11,
          `${label} ${point.netPnL.toFixed(0)}`,
          fill,
          edgeAnchor(x),
          placeAbove ? "auto" : "hanging"
        );
      });
    },
  },
};
export default utilitymixins;
