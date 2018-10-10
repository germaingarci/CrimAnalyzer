function rowBarChart(divName,values,data,topNames){
	var HorizontalBarChart={};
	//var divName="Barchart";
	HorizontalBarChart.svg = d3.select('#'+divName).append("svg");
	HorizontalBarChart.svg.append("g").attr("class", "grid");
	HorizontalBarChart.svg.append("g").attr("class", "secondGraph");
	HorizontalBarChart.svg.append("g").attr("class", "x axisb");
	HorizontalBarChart.svg.append("g").attr("class", "y axisb");
	HorizontalBarChart.svg.append("g").attr("class", "barGraph");

	HorizontalBarChart.margin = {"top":5,"left":10,"right":10,"bottom":30};
	let elementoDiv = document.getElementById(divName);
	HorizontalBarChart.height = elementoDiv.clientHeight;
	HorizontalBarChart.width  = elementoDiv.clientWidth;
	console.log(elementoDiv.clientWidth);
	console.log(divName);

	HorizontalBarChart.xScale = d3.scaleLinear();//.range([0, elementoDiv.clientWidth]);
	HorizontalBarChart.yScale = d3.scaleBand().padding(0.25);

	HorizontalBarChart.DrawGraph=function(){
		data.sort(function(a,b){return b[values]-a[values]});
		HorizontalBarChart.height =  data.length*20+20 ;

		

		HorizontalBarChart.svg.attr("height",HorizontalBarChart.height);
		HorizontalBarChart.svg.attr("width",HorizontalBarChart.width);

		let innerWidth  = HorizontalBarChart.width-HorizontalBarChart.margin.left - HorizontalBarChart.margin.right;
		let innerHeight = HorizontalBarChart.height-HorizontalBarChart.margin.top - HorizontalBarChart.margin.bottom;

		//HorizontalBarChart.svg.append("rect").attr("x",0).attr("y",0).attr("width",innerWidth).attr("height",innerHeight).attr("fill","none").attr("stroke","red");

		HorizontalBarChart.xScale.range([0,innerWidth]).domain([0,d3.max(data,function(d){return d.value;})]);
		HorizontalBarChart.yScale.range([0,innerHeight]).domain(data.map(function(r){return r.key;}));

		
		 HorizontalBarChart.svg.select(".grid")			
	      .attr("class", "grid")
	      .attr("transform", "translate("+HorizontalBarChart.margin.left+"," + innerHeight + ")")
	      .call(HorizontalBarChart.make_x_gridlines()
	          .tickSize(-innerHeight)
	          .tickFormat("")
	      )


		bars=HorizontalBarChart.svg.select(".barGraph")
						  .append("g")
						  .attr("width",innerWidth)
						  .attr("height",innerHeight)
						  .attr("transform","translate("+HorizontalBarChart.margin.left+","+HorizontalBarChart.margin.top+")")

		//bars.append("rect").attr("x",0).attr("y",0).attr("width",innerWidth).attr("height",innerHeight).attr("stroke","red");

		bars.selectAll(".bars")
			.data(data)
			.enter()
			.append("rect")
			.attr("id",function(d){
				var temp=d.key.toString().split(' ').join('');
				return divName+"_"+temp.split('.').join('');
			})
			.attr("class","bar")
			.attr("y",function(g){		return HorizontalBarChart.yScale(g.key);	})
			.attr("x",HorizontalBarChart.xScale(0))
			.attr("height", HorizontalBarChart.yScale.bandwidth())
			.attr("width",function(g){return HorizontalBarChart.xScale(g.value);})
			.attr("fill",function(d){
				let index=topNames.indexOf(d.key);
				if(index<0){return "#71C1B4";}else{ return "#267BA0"};
			})
			.attr("opacity",0.5);

		bars.selectAll(".bars")
			.data(data)
			.enter()
			.append("rect")
			.attr("y",function(g){ return HorizontalBarChart.yScale(g.key);	})
			.attr("x",HorizontalBarChart.xScale(0))
			.attr("height", HorizontalBarChart.yScale.bandwidth())
			.attr("width",function(g){return innerWidth;})
			.attr("fill","white")
			.attr("opacity",0)
			.on("mouseover", function(d) {		
		            div.transition()		
		                .duration(200)		
		                .style("opacity", .9);		
		            div	.html(d.key.toString().toLowerCase() + ": "  + d.value)	
		                .style("left", (d3.event.pageX) + "px")		
		                .style("top", (d3.event.pageY - 10) + "px");	
		            })					
        	.on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        	})
			.on("click",function(d){
					let index=topNames.indexOf(d.key);
					let temp=d.key.toString().split(' ').join('');
				    if(index<0){
				    	topNames.push(d.key);
					    d3.select("#"+divName+"_"+temp.split('.').join('')).attr("fill","#267BA0");
				    }else{
				    	topNames.splice(index,1);
					    d3.select("#"+divName+"_"+temp.split('.').join('')).attr("fill","#71C1B4");
				    }

			})


		let yAxis = d3.axisRight(HorizontalBarChart.yScale)
	            	.tickSize(0);

        HorizontalBarChart.svg.select(".y.axisb")
            .attr("class", "y axisb")
            .attr("transform","translate("+HorizontalBarChart.margin.left+","+HorizontalBarChart.margin.top+")")
            .call(yAxis);

        /*HorizontalBarChart.svg.selectAll(".y.axis .tick")
				.on("click", function(d) {  console.log(d);})
		;*/

        let xAxis = d3.axisBottom(HorizontalBarChart.xScale).ticks(5);

        HorizontalBarChart.svg.select(".x.axisb")
        	.attr("transform", "translate("+HorizontalBarChart.margin.left+"," + innerHeight + ")")
        	.call(xAxis)
        	.selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
	}

	HorizontalBarChart.make_x_gridlines=function() {		
   		return d3.axisBottom(HorizontalBarChart.xScale)
       		.ticks(3)
	}
	return HorizontalBarChart;
}