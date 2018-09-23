var GlobalTemporalView,
	CumulativeTemporalView;
var Global={};
/*diagrams initialization*/
//------------------GLOBAL TEMPORAL VIEW

var myDiv 						= document.getElementById("timeline");
var GlobalTemporalView 			= d3.select("#timeline").append("svg").attr("width",myDiv.clientWidth);
var GlobalTemporalView_options	= {"margin"  : {top: 10, right: 30, bottom: 20, left: 30},
									 "width" : myDiv.clientWidth,
									 "height": myDiv.clientHeight};
 

//------------------CUMULATIVE TEMPORAL VIEW
/*var CumulativeTemporalView 				= d3.select("#cumulativeBarChart").append("svg");
var myDiv_CumulativeTemporalView 	= document.getElementById("cumulativeBarChart");
var CumulativeTemporalView_options 	= {"margin" : {top: 10, right: 30, bottom: 25, left: 30},
										"width"	: myDiv_CumulativeTemporalView.clientWidth,
										"height": myDiv_CumulativeTemporalView.clientHeight};*/


Global.margin 		= {top: 10, right: 30, bottom: 20, left: 30};
Global.width 		= myDiv.clientWidth;
Global.height 		= myDiv.clientHeight;
Global.xScale 		= d3.scaleTime(),
Global.yScale 		= d3.scaleLinear();
Global.overlapDiv;
var transition 		= d3.transition()
						.ease(d3.easePolyInOut);

var lat = GlobalTemporalView.append('g')
	 .attr('class', 'latt')
	 .attr('height', Global.height)
     .attr('width', Global.width)
     .attr("transform", "translate(" + Global.margin.left + "," + Global.margin.top + ")");

var divOverlap=lat.append("g");

var latArea = d3.area()
	.x(function (d) {    return Global.xScale(d[0]); })
	.y1(function (d) {   return Global.yScale(d[1]);  })
	.y0(function (d) {   return Global.yScale(0);  })
	.curve(d3.curveCardinal);

var createHistogram = function createHistogram(group, area, nest) {
	var data = nest.map(function(d, i) {
       return [d.key, d.value];
	});

	Global.xScale.domain(d3.extent(data, function(d) { return d[0]; }))
			.range([0, Global.width - Global.margin.left - Global.margin.right]);

		    // Update the y-scale.
	var maximo= d3.max(data, function(d) { return d[1]; });
	Global.yScale.domain([0, maximo])
      		.range([Global.height - Global.margin.top - Global.margin.bottom, 0]);

    group.append('path').attr('fill', 'none').attr('stroke', 'grey').attr('d', area(data));
    //group.append('path').attr('class', 'comp1').attr('fill', 'red').attr('stroke', 'red');
 };

lat.append("g").attr("class", "brush")
		        .call(d3.brushX()
		        .extent([
		          [0,0],
		          [Global.xScale.range()[1], Global.yScale.range()[0]]
		        ])
		        .on("brush", brushed)
		      	);

var updateHistogram = function updateHistogram( group, area, nest, scale) {
	var data = nest.map(function(d, i) {
       return [d.key, d.value];
	}); 
 	 area.y1(function (d) {  return Global.yScale(d[1]);  });
 	 //group.select('path.comp1').transition(transition).attr('d', area(nest));
 	 group.append('path').attr('class', 'comp1').transition(transition).attr('fill', 'red').attr('d', area(data));
 }
 
 var updateHistogramRemove = function updateHistogramRemove( group) {
 	 //group.select('path.comp1').transition().remove();
 	 group.select('path.comp1').transition(transition).remove();
 } 

 var update = function update(OtherData) {
    updateHistogram(divOverlap, latArea, OtherData, Global.yScale);
 };

function brushed() {
	if (!d3.event.sourceEvent) return; // Only transition after input.
	if (!d3.event.selection) return; // Ignore empty selections.
	var selection = d3.event.selection.map(Global.xScale.invert);
}

/*
function Draw_GlobalTemporalView(data){
	var data = data.map(function(d, i) {
       return [d.key, d.value];
	});

	Global.xScale.domain(d3.extent(data, function(d) { return d[0]; }))
			.range([0, Global.width - Global.margin.left - Global.margin.right]);

		    // Update the y-scale.
	var maximo= d3.max(data, function(d) { return d[1]; });
	yScale.domain([0, maximo])
      		.range([Global.height - Global.margin.top - Global.margin.bottom, 0]);
}*/

/*function makeGraphs(){
	GlobalTemporalView =new  timeSeriesChart(GlobalTemporalView_options)
						 .data(Data_GlobalTemporalView)
						 .x(function (d) { return d.key;})
  						 .y(function (d) { return d.value;});
	d3.select('#timeline')
            .call(GlobalTemporalView);


    CumulativeTemporalView =new  barChart(CumulativeTemporalView_options)
    							 .data(Data_CumulativeTemporalView_Month)
    							 .x(function (d) { return d.key;})
                      			 .y(function (d) { return d.value;});

    d3.select('#acumulativeBarChart')
    		 //.datum(csData.labelMonth.all())
             .call(CumulativeTemporalView)
             .select(".x.axis")
      		 .selectAll(".tick text")
      		 .attr("transform", "translate(-10,5) rotate(-45)");
}

function overlap_GlobalTemporalView(){
	GlobalTemporalView.overlapData(csData.time.all());
}*/

function makeGraphs(){
	createHistogram(divOverlap, latArea, Data_GlobalTemporalView);
}

function overlap_GlobalTemporalView(data){
	updateOverlap(data);
	updateCumulative(data);
}
/*
function updateEliminar(){
	updateHistogramRemove(divOverlap);
}*/