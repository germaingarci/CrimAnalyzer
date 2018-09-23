function barChart(options) {
    // All options that should be accessible to caller
    var width       = parseInt(options["width"]);
    var height      = parseInt(options["height"]);

    var margin = options.margin,
    innerWidth = width - margin.left - margin.right,
    innerHeight = height - margin.top - margin.bottom;

    var barPadding = 1;
    var data = [];

    var updateWidth;
    var updateHeight;
    var updateFillColor;
    var updateData;

    var xValue = function(d) { return d[0]; },
    yValue = function(d) { return d[1]; },
    xScale = d3.scaleBand().padding(barPadding),
    yScale = d3.scaleLinear();

    function chart(selection){
        selection.each(function () {
            data = data.map(function(d, i) {
                return [xValue.call(data, d, i), yValue.call(data, d, i),d.value];//,MisDatos.overlapData[i].newvalue,MisDatos.overlapData[i].value];
            });

            var maxValue= d3.max(data, function(d) { return d[1]; });

            var barSpacing  = innerWidth / data.length;
            var barwidth    = barSpacing - barPadding;
            var widthScale  = innerHeight / maxValue;

            xScale.rangeRound([0, innerWidth])
                    .domain(data.map(function(d){return d[0];}));//data.map(xValue));

   
            yScale.rangeRound([innerHeight, 0])
                  .domain([0,maxValue]);

            var dom = d3.select(this);

            var svg = dom.append('svg')
                .attr('height', height)
                .attr('width', width);
            
            var gEnter = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //gEnter.select(".x.axis")
                gEnter.append("g").attr("class", "x axis")
              .attr("transform", "translate(0," + innerHeight + ")")
              .call(d3.axisBottom(xScale));

            //gEnter.select(".y.axis")
                gEnter.append("g").attr("class", "y axis")
                  .call(d3.axisLeft(yScale).ticks(5))
                .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", "0.71em")
                  .attr("text-anchor", "end")
                  .text("Frequency");
            
            var bars = gEnter.selectAll('.bar')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', function (d, i) { return xScale(d[0]); /*i * barSpacing;*/  })
                .attr('y', function (d)    { return yScale(d[1]);  })
                .attr('width', xScale.bandwidth())
                .attr('height', function (d) { return innerHeight-yScale(d[1]); })
                .attr("fill","#ccc");

            /*var bars = g.selectAll(".bar")
                       .datum(data);

            bars.enter().append("rect")
                  .attr("class", "bar")
                .merge(bars)
                  .attr("x", X)
                  .attr("y", Y)
                  .attr("width", xScale.bandwidth())
                  .attr("height", function(d) { return innerHeight+0.5 - Y(d); })
                  .attr("fill","#ccc");
                  //.on("mouseover", onMouseOver)
                  //.on("mouseout", onMouseOut);

              bars.exit().remove();*/


        });
    }

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        if (typeof updateWidth === 'function') updateWidth();
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        if (typeof updateHeight === 'function') updateHeight();
        return chart;
    };

    chart.fillColor = function(value) {
        if (!arguments.length) return fillColor;
        fillColor = value;
        if (typeof updateFillColor === 'function') updateFillColor();
        return chart;
    };

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        if (typeof updateData === 'function') updateData();
        return chart;
    };

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

    return chart;
}