<template>
  <div class="chart"></div>
</template>

<script>
import myMixins from "../../shared/utilitymixins";
// import * as d3 from "d3";
export default {
  name: "Builder",
  components: {},
  computed: {
    //   ...mapState(["TradeDetail","Portfolio"])
  },
  created() {},
  data() {
    return {
      isOn: false,
      active: true,
      open: false,
      navigation: { categories: ["Home", "Home2", "Home3"] },
    };
  },
  methods: {
    // onload: function () {
    //   var minY = 0
    //   var data = [{"date":"2019-12-31T18:30:00.000Z","index":0},{"date":"2020-01-01T18:30:00.000Z","index":0},{"date":"2020-01-02T18:30:00.000Z","index":0},{"date":"2020-01-03T18:30:00.000Z","index":0},{"date":"2020-01-04T18:30:00.000Z","index":0},{"date":"2020-01-05T18:30:00.000Z","index":0},{"date":"2020-01-06T18:30:00.000Z","index":0},{"date":"2020-01-07T18:30:00.000Z","index":0},{"date":"2020-01-08T18:30:00.000Z","index":0},{"date":"2020-01-09T18:30:00.000Z","index":0},{"date":"2020-01-10T18:30:00.000Z","index":0},{"date":"2020-01-11T18:30:00.000Z","index":0},{"date":"2020-01-12T18:30:00.000Z","index":0},{"date":"2020-01-13T18:30:00.000Z","index":0},{"date":"2020-01-14T18:30:00.000Z","index":0},{"date":"2020-01-15T18:30:00.000Z","index":0},{"date":"2020-01-16T18:30:00.000Z","index":0},{"date":"2020-01-17T18:30:00.000Z","index":0},{"date":"2020-01-18T18:30:00.000Z","index":0},{"date":"2020-01-19T18:30:00.000Z","index":0},{"date":"2020-01-20T18:30:00.000Z","index":3},{"date":"2020-01-21T18:30:00.000Z","index":3},{"date":"2020-01-22T18:30:00.000Z","index":4},{"date":"2020-01-23T18:30:00.000Z","index":8},{"date":"2020-01-24T18:30:00.000Z","index":9},{"date":"2020-01-25T18:30:00.000Z","index":10},{"date":"2020-01-26T18:30:00.000Z","index":11},{"date":"2020-01-27T18:30:00.000Z","index":11},{"date":"2020-01-28T18:30:00.000Z","index":11},{"date":"2020-01-29T18:30:00.000Z","index":12},{"date":"2020-01-30T18:30:00.000Z","index":11},{"date":"2020-01-31T18:30:00.000Z","index":9},{"date":"2020-02-01T18:30:00.000Z","index":8},{"date":"2020-02-02T18:30:00.000Z","index":7},{"date":"2020-02-03T18:30:00.000Z","index":6},{"date":"2020-02-04T18:30:00.000Z","index":5},{"date":"2020-02-05T18:30:00.000Z","index":6},{"date":"2020-02-06T18:30:00.000Z","index":6},{"date":"2020-02-07T18:30:00.000Z","index":5},{"date":"2020-02-08T18:30:00.000Z","index":5},{"date":"2020-02-09T18:30:00.000Z","index":5},{"date":"2020-02-10T18:30:00.000Z","index":5},{"date":"2020-02-11T18:30:00.000Z","index":4},{"date":"2020-02-12T18:30:00.000Z","index":5},{"date":"2020-02-13T18:30:00.000Z","index":4},{"date":"2020-02-14T18:30:00.000Z","index":4},{"date":"2020-02-15T18:30:00.000Z","index":4},{"date":"2020-02-16T18:30:00.000Z","index":4},{"date":"2020-02-17T18:30:00.000Z","index":4},{"date":"2020-02-18T18:30:00.000Z","index":3},{"date":"2020-02-19T18:30:00.000Z","index":3},{"date":"2020-02-20T18:30:00.000Z","index":3},{"date":"2020-02-21T18:30:00.000Z","index":4},{"date":"2020-02-22T18:30:00.000Z","index":5},{"date":"2020-02-23T18:30:00.000Z","index":7},{"date":"2020-02-24T18:30:00.000Z","index":11},{"date":"2020-02-25T18:30:00.000Z","index":15},{"date":"2020-02-26T18:30:00.000Z","index":18},{"date":"2020-02-27T18:30:00.000Z","index":18},{"date":"2020-02-28T18:30:00.000Z","index":20},{"date":"2020-02-29T18:30:00.000Z","index":17},{"date":"2020-03-01T18:30:00.000Z","index":26},{"date":"2020-03-02T18:30:00.000Z","index":25},{"date":"2020-03-03T18:30:00.000Z","index":23},{"date":"2020-03-04T18:30:00.000Z","index":28},{"date":"2020-03-05T18:30:00.000Z","index":30},{"date":"2020-03-06T18:30:00.000Z","index":30},{"date":"2020-03-07T18:30:00.000Z","index":29},{"date":"2020-03-08T18:30:00.000Z","index":37},{"date":"2020-03-09T18:30:00.000Z","index":44},{"date":"2020-03-10T18:30:00.000Z","index":55},{"date":"2020-03-11T18:30:00.000Z","index":96},{"date":"2020-03-12T18:30:00.000Z","index":86},{"date":"2020-03-13T18:30:00.000Z","index":79},{"date":"2020-03-14T18:30:00.000Z","index":100},{"date":"2020-03-15T18:30:00.000Z","index":96},{"date":"2020-03-16T18:30:00.000Z","index":84},{"date":"2020-03-17T18:30:00.000Z","index":79},{"date":"2020-03-18T18:30:00.000Z","index":77},{"date":"2020-03-19T18:30:00.000Z","index":73},{"date":"2020-03-20T18:30:00.000Z","index":74},{"date":"2020-03-21T18:30:00.000Z","index":75},{"date":"2020-03-22T18:30:00.000Z","index":69},{"date":"2020-03-23T18:30:00.000Z","index":63},{"date":"2020-03-24T18:30:00.000Z","index":59},{"date":"2020-03-25T18:30:00.000Z","index":58},{"date":"2020-03-26T18:30:00.000Z","index":58},{"date":"2020-03-27T18:30:00.000Z","index":56},{"date":"2020-03-28T18:30:00.000Z","index":54},{"date":"2020-03-29T18:30:00.000Z","index":50},{"date":"2020-03-30T18:30:00.000Z","index":48},{"date":"2020-03-31T18:30:00.000Z","index":46}];
    //   var inputs = {
    //     id: "",
    //     width: 940,
    //     height: 450,
    //     dimension: "date",
    //     metric: "index",
    //     title: "Test Title",
    //     color: "red",
    //     xAxisHidden: true,
    //     yAxisHidden: false,
    //     nonzeroMinY: true,
    //     mark: "2020-03-18",
    //     markText: "COVID-19",
    //     mouseover: true,
    //     indicator: true,
    //   };
    //   const width = inputs.width == "auto" ? autoWidth : inputs.width;
    //   const height = inputs.height;
    //   const dimension = inputs.dimension;
    //   const metric = inputs.metric;
    //   const title = inputs.title;
    //   const color = inputs.color;
    //   const xAxisHidden = inputs.xAxisHidden;
    //   const yAxisHidden = inputs.yAxisHidden;
    //   const mark = inputs.mark;
    //   const markText = inputs.markText;
    //   const mouseover = inputs.mouseover;
    //   const indicator = inputs.indicator;

    //   //   data
    //   const minValue = d3.min(data, (d) => d[metric]);
    //   const maxValue = d3.max(data, (d) => d[metric]);
    //   const maxValueX = data.filter((obj) => obj[metric] === maxValue)[0][
    //     dimension
    //   ];
    //   const minX = d3.min(data, (d) => d[dimension]);
    //   const maxX = d3.max(data, (d) => d[dimension]);
    //   // const maxX = maxDateInput ? new Date(maxDateInput) : d3.max(data, function(d) { return d.date; });
    //   //   ____

    //   const margin = { top: 6, right: 20, bottom: 15, left: 50 };
    //   if (xAxisHidden) {
    //     margin.bottom = 10;
    //   }
    //   if (yAxisHidden) {
    //     margin.left = 10;
    //   }
    //   // if (sparkline) {
    //   //   margin.top = 10;
    //   //   margin.right = 20;
    //   //   margin.bottom = 0;
    //   //   margin.left = 0;
    //   // }

    //   const x = d3
    //     .scaleTime()
    //     .domain(d3.extent(data, (d) => d[dimension]))
    //     .range([margin.left, inputs.width - margin.right]);

    //   const y = d3
    //     .scaleLinear()
    //     .domain([minY, d3.max(data, (d) => d[metric])])
    //     .nice()
    //     .range([height - margin.bottom, margin.top]);

    //   const svg = d3
    //     .create("svg")
    //     .attr("class", "line")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom);

    //   const lg = svg
    //     .append("defs")
    //     .append("linearGradient") // linear gradient
    //     .attr("id", "mygrad")
    //     .attr("x1", "0%")
    //     .attr("x2", "0%")
    //     .attr("y1", "0%")
    //     .attr("y2", "100%");
    //   lg.append("stop")
    //     .attr("offset", "0%")
    //     .style("stop-color", color)
    //     .style("stop-opacity", 0.15);
    //   lg.append("stop")
    //     .attr("offset", "100%")
    //     .style("stop-color", color)
    //     .style("stop-opacity", 0.01);

    //   const area = d3
    //     .area()
    //     .curve(d3.curveCardinal.tension(0.95))
    //     .defined(function (d) {
    //       return d[metric] >= 0;
    //     })
    //     .x(function (d) {
    //       return x(d[dimension]);
    //     })
    //     .y0(height - margin.bottom)
    //     .y1(function (d) {
    //       return y(d[metric]);
    //     });

    //   const line = d3
    //     .line()
    //     .defined((d) => !isNaN(d[metric]))
    //     .x((d) => x(d[dimension]))
    //     .y((d) => y(d[metric]));

    //   if (!xAxisHidden) {
    //     svg
    //       .append("g")
    //       .attr("class", "x axis")
    //       .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    //       .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%_m-%d")))
    //       .selectAll("text")
    //       .style("text-anchor", "end")
    //       .attr("dx", "-.6em")
    //       .attr("dy", ".5em")
    //       .attr("transform", "rotate(-45)");
    //   }

    //   if (!yAxisHidden) {
    //     svg
    //       .append("g")
    //       .attr("class", "y axis")
    //       .attr("transform", "translate(" + margin.left + ", 0)")
    //       .call(
    //         d3.axisLeft(y).tickFormat((d) => {
    //           if (d < 10) {
    //             return d3.format(".2f")(d);
    //           } else if (d > 999999) {
    //             return d3.format(".3s")(d).replace("G", "B");
    //           } else {
    //             return d3.format(",")(d);
    //           }
    //         })
    //       )
    //       .selectAll("text")
    //       .attr("dx", "-5");
    //   }

    //   svg
    //     .append("path")
    //     .datum(data)
    //     .attr("fill", "none")
    //     .attr("stroke", color)
    //     .attr("stroke-width", 1.5)
    //     .attr("stroke-linejoin", "round")
    //     .attr("stroke-linecap", "round")
    //     .attr("d", line);

    //   svg
    //     .append("path")
    //     .datum(data)
    //     .style("fill", "url(#mygrad)")
    //     .style("stroke", "none")
    //     .attr("d", area);

    //   if (indicator) {
    //     svg
    //       .append("line")
    //       .attr("x1", x(maxValueX))
    //       .attr("x2", width - margin.right)
    //       .attr("y1", y(maxValue))
    //       .attr("y2", y(maxValue))
    //       .style("stroke", "#333")
    //       .style("stroke-width", "1px")
    //       .style("stroke-dasharray", "3 3");

    //     svg
    //       .append("text")
    //       .attr("id", "max-indicator")
    //       .attr("x", width - margin.right + 5)
    //       .attr("y", function () {
    //         return 4 + y(maxValue);
    //       })
    //       .style("fill", "#333")
    //       .style("font-size", "11px")
    //       .text(() => {
    //         return maxValue < 10
    //           ? d3.format(".2")(maxValue)
    //           : d3.format(".3s")(maxValue).replace("G", "B");
    //       });
    //   }

    //   if (mark) {
    //     svg
    //       .append("rect")
    //       .classed("y", true)
    //       .attr("x", x(moment(mark)) - 1)
    //       .attr("y", y(0) - 2 * margin.bottom - 20)
    //       .attr("width", 2)
    //       .attr("height", 30)
    //       .style("fill", "black");
    //     if (markText) {
    //       svg
    //         .append("text")
    //         .attr("x", x(moment(mark)) + 5)
    //         .attr("y", y(0) - 2 * margin.bottom - 10)
    //         .text(markText);
    //     }
    //   }

    //   if (title) {
    //     svg
    //       .append("text")
    //       .attr("x", margin.left + 4)
    //       .attr("y", margin.top + 4)
    //       .attr("text-anchor", "start")
    //       .attr("font-size", "12px")
    //       .attr("font-weight", "bold")
    //       .text(title);
    //   }

    //   const focus = svg
    //     .append("g")
    //     .attr("class", "focus")
    //     .style("display", "none");

    //   focus.append("circle").attr("r", 2);
    //   focus
    //     .append("rect")
    //     .attr("x", -24)
    //     .attr("y", -22)
    //     .attr("width", 48)
    //     .attr("height", 18)
    //     .style("fill", "#F2F3F4");
    //   focus
    //     .append("text")
    //     .attr("y", -12)
    //     .attr("dy", ".35em")
    //     .style("text-anchor", "middle");

    //   if (mouseover) {
    //     svg
    //       .append("rect")
    //       .attr("class", "overlay")
    //       .attr("x", margin.left)
    //       .attr("width", width - margin.right - 1)
    //       .attr("height", height)
    //       .style("fill", "none")
    //       .style("pointer-events", "all")
    //       .on("mouseover", () => focus.style("display", null))
    //       .on("mouseout", () => focus.style("display", "none"))
    //       .on("mousemove", mousemove);
    //   }

    //   const bisectDate = d3.bisector((d) => d.date).left;

    //   function mousemove() {
    //     const x0 = x.invert(d3.mouse(this)[0]);
    //     const i = bisectDate(data, x0, 1);
    //     const d0 = data[i - 1];
    //     const d1 = data[i];
    //     if (d0 && d1) {
    //       const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    //       focus.attr("transform", `translate(${x(d.date)}, ${y(d[metric])})`);

    //       if (maxValue > 999) {
    //         focus
    //           .select("text")
    //           .text(d3.format(".3s")(d[metric]).replace("G", "B"));
    //       } else if (maxValue < 10) {
    //         focus.select("text").text(d3.format(".2")(d[metric]));
    //       } else {
    //         focus.select("text").text(d3.format(",.1f")(d[metric]));
    //       }
    //     }
    //   }

    //   return svg.node();
    // },
  },
  mounted() {
    this.onload();
  },
  mixins: [myMixins],
  props: {},
};
</script>

<style>
</style>