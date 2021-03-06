/* global d3 */

function barChart(options) {
  var data=[];
  var margin   = options.margin,
     width     = parseInt(options["width"]);
     height    = parseInt(options["height"]);
    innerWidth = width - margin.left - margin.right,
    innerHeight = height - margin.top - margin.bottom,

    xValue = function(d) { return d[0]; },
    yValue = function(d) { return d[1]; },
    xScale = d3.scaleBand().padding(0.1),
    yScale = d3.scaleLinear(),
    onMouseOver = function () { },
    onMouseOut = function () { };

  function chart(selection) {
    selection.each(function () {

      //dataFlat.data.sort(function(a, b) { return a.index - b.index; });
      // Select the svg element, if it exists.
      var svg = d3.select(this);

      // Otherwise, create the skeletal chart.
      var svgEnter = svg.append("svg");

      var gEnter = svgEnter.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     // gEnter.append("g").attr("class", "x axis");
     // gEnter.append("g").attr("class", "y axis");
      
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom,


      xScale.rangeRound([0, innerWidth])
        .domain(data.map(xValue));

      //yScale.rangeRound([innerHeight, 0])
      //  .domain([0, d3.max(dataFlat.data, yValue)]);

      //Manejar una misma escala
   
      yScale.rangeRound([innerHeight, 0])
        .domain([0,d3.max(data, yValue)]);

        //g.select(".x.axis")
      gEnter.append("g").attr("class", "x axis")
          .attr("transform", "translate(0," + innerHeight + ")")
          .call(d3.axisBottom(xScale));

      //g.select(".y.axis")
        gEnter.append("g").attr("class", "y axis")
          .call(d3.axisLeft(yScale).ticks(5))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Frequency");

      var mybars=gEnter.append("g")
            .attr('width', innerWidth)
            .attr('height', innerHeight);

       var bars = mybars.selectAll('bar')
                .data(data)
                .enter()
                .append('rect')
                .attr("x", X)
              .attr("y", Y)
              .attr("width", xScale.bandwidth())
              .attr("height", function(d) { return innerHeight+0.5 - Y(d); })
              .attr("fill","#ccc")
              .on("mouseover", onMouseOver)
              .on("mouseout", onMouseOut);


      /*var bars = g.selectAll(".bar")
          .data(function (d) { return d; });

      bars.enter().append("rect")
          .attr("class", "bar")
        .merge(bars)
          .attr("x", X)
          .attr("y", Y)
          .attr("width", xScale.bandwidth())
          .attr("height", function(d) { return innerHeight+0.5 - Y(d); })
          .attr("fill","#ccc")
          .on("mouseover", onMouseOver)
          .on("mouseout", onMouseOut);*/

      bars.exit().remove();
    });

  }

// The x-accessor for the path generator; xScale ∘ xValue.
  function X(d) {
    return xScale(xValue(d));
  }

  // The y-accessor for the path generator; yScale ∘ yValue.
  function Y(d) {
    return yScale(yValue(d));
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.onMouseOver = function(_) {
    if (!arguments.length) return onMouseOver;
    onMouseOver = _;
    return chart;
  };

  chart.onMouseOut = function(_) {
    if (!arguments.length) return onMouseOut;
    onMouseOut = _;
    return chart;
  };

  chart.data = function(value) {
     if (!arguments.length) return data;
     data = value;
     if (typeof updateData === 'function') updateData();
     return chart;
  };

  return chart;
}



