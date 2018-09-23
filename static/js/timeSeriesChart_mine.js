function temporalVisualization(options,nameDiv){
	
	this.margin		= options.margin;
	this.width 		 = parseInt(options["width"]);
    this.height 	 = parseInt(options["height"]);
    this.data 		 = [];
    this.overlapData = [];

    this.Global_xScale = d3.scaleTime();
    this.Global_yScale = d3.scaleLinear();

    this.area = d3.area().x(this.X).y1(this.Y);//.curve(d3.curveBasis),
    this.line = d3.line().x(this.X).y(this.Y);//.curve(d3.curveBasis),

    this.init_Data=function(refData){
    	data = refData.map(function(d, i) {
        		return [d.key,d.value];//,MisDatos.overlapData[i].newvalue,MisDatos.overlapData[i].value];
      	});
    }

    this.chart=function(refData){
    	this.init_Data(refData);

    	this.xScale
		        .domain(d3.extent(this.data, function(d) { return d[0]; }))
		        .range([0, width - margin.left - margin.right]);

		    // Update the y-scale.
		var maximo= d3.max(this.data, function(d) { return d[1]; });
		this.yScale
		        .domain([0, maximo])
		        .range([height - margin.top - margin.bottom, 0]);

		var svg = d3.select(nameDiv);

		var svgEnter = svg.append("svg")
		      				 .attr('height', this.height)
                			 .attr('width',  this.width)

               var gEnter = svgEnter.append("g")
               				.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


         gEnter.append("path").attr("class", "area")
		       		 .datum(this.data)
		          	 .attr("d", this.area.y0(this.yScale.range()[0]));

		      // Update the line path.
		 gEnter.append("path").attr("class", "line")
		       		 .datum(this.data)
		          	 .attr("d", this.line);

    }

    this.X=function(d) {
	  return this.xScale(d[0]);
	}

	// The y-accessor for the path generator; yScale ∘ yValue.
	this.Y=function(d) {
	  return this.yScale(d[1]);
	}

}