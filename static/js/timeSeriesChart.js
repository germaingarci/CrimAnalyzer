function timeSeriesChart(options) {
	var margin		= options.margin;
	var width 		= parseInt(options["width"]);
    var height 		= parseInt(options["height"]);
    var data 		= [];
    var overlapData = [];
    var updateData;
    var updateOverlapData;


    var xValue = function(d) { return d[0]; },
    yValue = function(d) { return d[1]; },
    zValue = function(d) { return d[2]; };
    //var mainSvg=panel;
    
    Global_xScale = d3.scaleTime(),
    Global_yScale = d3.scaleLinear(),

    area = d3.area().x(X).y1(Y),//.curve(d3.curveBasis),
    line = d3.line().x(X).y(Y),//.curve(d3.curveBasis),

    areaOverlap = d3.area().x(X).y1(Y),

    onBrushed = function () {},
    onBrush_end=function(){},
    ActualizarDatos=function(){};


	function chart(selection) {
		selection.each(function() {
			data = data.map(function(d, i) {
        		return [xValue.call(data, d, i), yValue.call(data, d, i),d.value];//,MisDatos.overlapData[i].newvalue,MisDatos.overlapData[i].value];
      		});

			// Update the x-scale.
		    Global_xScale
		        .domain(d3.extent(data, function(d) { return d[0]; }))
		        .range([0, width - margin.left - margin.right]);

		    // Update the y-scale.
		    var maximo= d3.max(data, function(d) { return d[1]; });
		    Global_yScale
		        .domain([0, maximo])
		        .range([height - margin.top - margin.bottom, 0]);

		    // Select the svg element, if it exists.


		      var svg = d3.select(this);//.selectAll("svg").data(data);

		      // Otherwise, create the skeletal chart.
		      var svgEnter = svg.append("svg")
		      				 .attr('height', height)
                			 .attr('width', width)

               var gEnter = svgEnter.append("g")
               				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		     // var gEnter = svgEnter.append("g");

		      //gEnter.append("g").attr("class", "x axis");
		      		    
		      // Update the area path.
		       gEnter.append("path").attr("class", "area")
		       		 .datum(data)
		          	 .attr("d", area.y0(Global_yScale.range()[0]));

		      // Update the line path.
		       gEnter.append("path").attr("class", "line")
		       		 .datum(data)
		          	 .attr("d", line);

		      
		       gEnter.append("g").attr("class", "x axis")
		          .attr("transform", "translate(0," + Global_yScale.range()[0] + ")")
		          .call(d3.axisBottom(Global_xScale).tickSize(6, 0));

		        gEnter.append("g").attr("class", "y axis")
		         .call(d3.axisLeft(Global_yScale).ticks(5))
		        .append("text")
		          .attr("transform", "rotate(-90)")
		          .attr("y", 6)
		          .attr("dy", "0.71em")
		          .attr("text-anchor", "end")
		          .text("Frequency");

		        gEnter.append("g").attr("class", "brush")
		        .call(d3.brushX()
		        .extent([
		          [0,0],
		          [Global_xScale.range()[1], Global_yScale.range()[0]]
		        ])
		        .on("brush", brushed)
		      	);


		    updateOverlapData=function(){

		    	overlapData = overlapData.map(function(d, i) {
        		return [xValue.call(overlapData, d, i), yValue.call(overlapData, d, i),d.value];
      			});

		    	gEnter.append("path").attr("class", "area")
		       		 .datum(overlapData)
		       		 .attr("fill","red")
		          	 .attr("d", areaOverlap.y0(Global_yScale.range()[0]));

		    }

		});
	}

	function brushed() {
	  if (!d3.event.sourceEvent) return; // Only transition after input.
	  if (!d3.event.selection) return; // Ignore empty selections.
	  var selection = d3.event.selection.map(Global_xScale.invert);

	  onBrushed(selection);
	}

	// The x-accessor for the path generator; xScale ∘ xValue.
	function X(d) {
	  return Global_xScale(d[0]);
	}

	// The y-accessor for the path generator; yScale ∘ yValue.
	function Y(d) {
	  return Global_yScale(d[1]);
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

	chart.onBrushed = function(_) {
	  if (!arguments.length) return onBrushed;
	  onBrushed = _;
	  return chart;
	};

	chart.data = function(value) {
	   if (!arguments.length) return data;
	   data = value;
	   if (typeof updateData === 'function') updateData();
	   return chart;
	};

	chart.overlapData = function(value) {
        if (!arguments.length) return overlapData;
        overlapData = value;
        if (typeof updateOverlapData === 'function') updateOverlapData();
    };

	return chart;
}