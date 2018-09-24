/*------------------------------------------------------------------------------------*/
/*                  Global Temporal View*/
/*------------------------------------------------------------------------------------*/
var GlobalTemporalView      = {}
var myDiv                   = document.getElementById("timeline");
GlobalTemporalView.Graph    = d3.select("#timeline").append("svg").attr("width",myDiv.clientWidth);

GlobalTemporalView.margin     = {top: 10, right: 30, bottom: 20, left: 30};
GlobalTemporalView.width      = myDiv.clientWidth;
GlobalTemporalView.height     = myDiv.clientHeight;
GlobalTemporalView.xScale     = d3.scaleTime(),
GlobalTemporalView.yScale     = d3.scaleLinear();
GlobalTemporalView.overlapDiv;
var transition    = d3.transition()
            .ease(d3.easePolyInOut);


GlobalTemporalView.svg = GlobalTemporalView.Graph.append('g')
                           .attr('class', 'lat')
                           .attr('height', GlobalTemporalView.height)
                           .attr('width', GlobalTemporalView.width)
                           .attr("transform", "translate(" + GlobalTemporalView.margin.left + "," + GlobalTemporalView.margin.top + ")");

GlobalTemporalView.svg.append("g").attr("class", "area");
GlobalTemporalView.svg.append("g").attr("class", "line");
GlobalTemporalView.svg.append("g").attr("class", "secondLineChart");
GlobalTemporalView.svg.append("g").attr("class", "patternChart");
GlobalTemporalView.svg.append("g").attr("class", "x axis");
GlobalTemporalView.svg.append("g").attr("class", "y axis");
GlobalTemporalView.svg.append("g").attr("class", "brush");

function GlobalTemporalView_Init(){
  
      GlobalTemporalView.svg.select(".area").selectAll("*").remove();
      GlobalTemporalView.svg.select(".line").selectAll("*").remove();
      GlobalTemporalView.svg.select(".secondLineChart").selectAll("*").remove();
      GlobalTemporalView.svg.select(".patternChart").selectAll("*").remove();
      GlobalTemporalView.svg.select(".x.axis").selectAll("*").remove();
      GlobalTemporalView.svg.select(".y.axis").selectAll("*").remove();
      GlobalTemporalView.svg.select(".brush").selectAll("*").remove();

}

var LalLinea = d3.line()
                 .x(function (d) {   return GlobalTemporalView.xScale(d[0]); })
                 .y(function (d) {   return GlobalTemporalView.yScale(d[1]);  })
                 .curve(d3.curveCardinal);

var latArea = d3.area()
  .x(function (d)  {   return GlobalTemporalView.xScale(d[0]); })
  .y1(function (d) {   return GlobalTemporalView.yScale(d[1]);  })
  .y0(function (d) {   return GlobalTemporalView.yScale(0);  })
  .curve(d3.curveCardinal);


var CreateGlobalTemporalView =function CreateGlobalTemporalView(group, area, nest){
    var data = nest.map(function(d, i) {return [new Date(d.key), d.value]; });

    GlobalTemporalView.xScale.domain(d3.extent(data, function(d) { return d[0]; }))
              .range([0, GlobalTemporalView.width - GlobalTemporalView.margin.left - GlobalTemporalView.margin.right]);

    var maximo= d3.max(data, function(d) { return d[1]; });
    GlobalTemporalView.yScale.domain([0, maximo])
            .range([GlobalTemporalView.height - GlobalTemporalView.margin.top - GlobalTemporalView.margin.bottom, 0]);
    
    //GlobalTemporalView.svg.select(".area").append('path').attr('fill', 'none').attr('stroke', 'grey').attr('d', area(data));
    GlobalTemporalView.svg.select(".area")
                      .append('path')
                      .attr('class','globalTemporalSerie')
                      .attr('d', area(data));

    GlobalTemporalView.svg.select(".line")
                      .append('path')
                      .attr('class','globalTemporalSerieLine')
                      .attr('d', LalLinea(data));
                      
    GlobalTemporalView.svg.select(".x.axis")
          .attr("transform", "translate(0," + GlobalTemporalView.yScale.range()[0] + ")")
          .call(d3.axisBottom(GlobalTemporalView.xScale).tickSize(6, 0));

    GlobalTemporalView.svg.select(".y.axis")
          .call(d3.axisLeft(GlobalTemporalView.yScale).ticks(5))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Frequency");

    GlobalTemporalView.svg.select(".brush").call(d3.brushX()
        .extent([
          [0,0],
          [GlobalTemporalView.xScale.range()[1], GlobalTemporalView.yScale.range()[0]]
        ])
        .on("brush", brushed)
      );

}

var updateOverlapArea = function updateOverlapArea( group, area, nest, scale) {
      var data = nest.map(function(d, i) {
           return [new Date(d.key), d.value];
      }); 
      area.y1(function (d) {  return GlobalTemporalView.yScale(d[1]);  });
      //group.select('path.comp1').transition(transition).attr('d', area(nest));
      //GlobalTemporalView.svg.select(".secondLineChart").append('path').attr('class', 'comp1').transition(transition).attr('fill', 'red').attr('d', area(data));
      GlobalTemporalView.svg.select(".secondLineChart").append('path').attr('class', 'comp1').attr('d', area(data));
 }

var updateOverlapAreaRemove = function updateHistogramRemove() {
   //group.select('path.comp1').transition().remove();
   //GlobalTemporalView.svg.select(".secondLineChart").select('path.comp1').transition(transition).remove();
   GlobalTemporalView.svg.select(".secondLineChart").select('path.comp1').remove();
} 

var updateOverlap = function updateOverlap(data) {
    updateOverlapArea(GlobalTemporalView.svg, latArea, data, GlobalTemporalView.yScale);
};

function brushed(){
    if (!d3.event.sourceEvent) return; // Only transition after input.
    if (!d3.event.selection) return; // Ignore empty selections.
    var selection = d3.event.selection.map(GlobalTemporalView.xScale.invert);

}

//CreateGlobalTemporalView(GlobalTemporalView.svg,latArea,toyData);
var GlobalCumulativeTemporalView      = {};
var myDiv_TotalCumulativeTemporalView = document.getElementById("Total_Cumulative_BarChart");
GlobalCumulativeTemporalView.Graph    = d3.select("#Total_Cumulative_BarChart")
                                        .append("svg")
                                        .attr("width",myDiv_TotalCumulativeTemporalView.clientWidth)
                                        .attr("height",myDiv_TotalCumulativeTemporalView.clientHeight);



/*-------------------------------------------------
 -----------------------------------*/
/*                  Cumulative Temporal View*/
/*------------------------------------------------------------------------------------*/
var CumulativeTemporalView={};
//var myDiv_CumulativeTemporalView  = document.getElementById("cumulativeBarChart");
//CumulativeTemporalView.Graph      = d3.select("#cumulativeBarChart").append("svg").attr("width",myDiv_CumulativeTemporalView.clientWidth);

CumulativeTemporalView.margin     = {top: 10, right: 10, bottom: 30, left: 35};
CumulativeTemporalView.width      = myDiv_TotalCumulativeTemporalView.clientWidth*0.50//myDiv_CumulativeTemporalView.clientWidth;
CumulativeTemporalView.height     = myDiv_TotalCumulativeTemporalView.clientHeight;//myDiv_CumulativeTemporalView.clientHeight;

CumulativeTemporalView.xScale     = d3.scaleBand().padding(0.2);
CumulativeTemporalView.yScale     = d3.scaleLinear();

/*CumulativeTemporalView.svg = CumulativeTemporalView.Graph.append('g')
                             .attr('class', 'barchart')
                             .attr("transform", "translate(" + CumulativeTemporalView.margin.left + "," + CumulativeTemporalView.margin.top + ")");*/

CumulativeTemporalView.svg = GlobalCumulativeTemporalView.Graph.append('g')
                             .attr('class', 'barchart')
                             .attr("transform", "translate(" + 0 + "," + CumulativeTemporalView.margin.top + ")");

//CumulativeTemporalView.svg.append("rect").attr("x",0).attr("y",0).attr("width",CumulativeTemporalView.width).attr("height",CumulativeTemporalView.height).attr("fill","red").attr("fill-opacity",0.5);;
CumulativeTemporalView.svg.append("g").attr("class", "barGraph");
CumulativeTemporalView.svg.append("g").attr("class", "secondGraph");
CumulativeTemporalView.svg.append("g").attr("class", "x axis");
CumulativeTemporalView.svg.append("g").attr("class", "y axis");


function CumulativeTemporalView_Init(){
      CumulativeTemporalView.svg.select(".barGraph").selectAll("*").remove();
      CumulativeTemporalView.svg.select(".secondGraph").selectAll("*").remove();
      CumulativeTemporalView.svg.select(".x.axis").selectAll("*").remove();
      CumulativeTemporalView.svg.select(".y.axis").selectAll("*").remove();
}

function CrearCumulativeTemporalView(group, area, nest){
      var data = nest.map(function(d, i) {return [d.key, d.value];   });
      innerWidth = CumulativeTemporalView.width - CumulativeTemporalView.margin.right,
      innerHeight = CumulativeTemporalView.height - CumulativeTemporalView.margin.top - CumulativeTemporalView.margin.bottom,


      //CumulativeTemporalView.xScale.rangeRound([0, innerWidth]).domain(data.map(function(d){return d[0];}));

      CumulativeTemporalView.xScale
                    .rangeRound([CumulativeTemporalView.margin.left, innerWidth])
                    .domain(MonthLabels);

      CumulativeTemporalView.yScale.rangeRound([innerHeight, 0])
                        .domain([0,d3.max(data, function(d){return d[1];})]);

      CumulativeTemporalView.svg.select(".x.axis")
            .attr("transform", "translate(0," + innerHeight + ")")
            .call(d3.axisBottom(CumulativeTemporalView.xScale))
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });

      CumulativeTemporalView.svg.select(".y.axis")
        .attr("transform", "translate("+CumulativeTemporalView.margin.left+",0)")
          .call(d3.axisLeft(CumulativeTemporalView.yScale).ticks(5))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Frequency");

      var mybars=CumulativeTemporalView.svg.select(".barGraph")
            .append("g")
            .attr('width', innerWidth)
            .attr('height', innerHeight);

       var bars = mybars.selectAll('bar')
                .data(data)
                .enter()
                .append('rect')
                .attr("x", function(d){
                  return CumulativeTemporalView.xScale(d[0]);
                })
                .attr("y", function(d){
                  return CumulativeTemporalView.yScale(d[1]);
                })
                .attr("width", CumulativeTemporalView.xScale.bandwidth())
                .attr("height", function(d) { 
                    return innerHeight+0.5 - CumulativeTemporalView.yScale(d[1]); 
                  })
                .attr("class","barTemporalSerie");
                //.attr("fill","none")
                //.attr("stroke","grey");
              //.on("mouseover", onMouseOver)
              //.on("mouseout", onMouseOut);

}

var updateCumulativeView = function updateCumulativeView(group, area, nest) {
    var data = nest.map(function(d, i) {
           return [d.key, d.value-10];
      }); 

    CumulativeTemporalView.svg.select(".secondGraph").selectAll('bars')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'barOverlap')
                .attr("x", function(d){
                      return CumulativeTemporalView.xScale(d[0]);
                })
                .attr("y", function(d){
                      return CumulativeTemporalView.yScale(d[1]);
                })
                .attr("width", CumulativeTemporalView.xScale.bandwidth())
                .attr("height", function(d) { 
                      return innerHeight+0.5 - CumulativeTemporalView.yScale(d[1]); 
                  });
                //.attr("fill","green")
                //.attr("stroke","black");
}

var updateCumulativeViewRemove = function updateCumulativeViewRemove(){
    //CumulativeTemporalView.svg.select(".secondGraph").selectAll('.bar').transition(transition).remove();
    CumulativeTemporalView.svg.select(".secondGraph").selectAll('.barOverlap').remove();
}

function updateCumulative(data){
  updateCumulativeView(CumulativeTemporalView.svg,null,data);
}

//CrearCumulativeTemporalView(CumulativeTemporalView.svg,null, toyDataCumulative);

/**************************************************************************************************************************/
/**************************************************************************************************************************/
/**************************************************************************************************************************/
/*------------------------------------------------------------------------------------*/
/*                  Cumulative Temporal View Day*/
/*------------------------------------------------------------------------------------*/
var CumulativeTemporalView_Day={};
//var myDiv_CumulativeTemporalView_Day  = document.getElementById("cumulativeBarChart_Day");
//CumulativeTemporalView_Day.Graph    = d3.select("#cumulativeBarChart_Day").append("svg").attr("width",myDiv_CumulativeTemporalView_Day.clientWidth);

CumulativeTemporalView_Day.margin     = {top: 10, right: 10, bottom: 30, left: 35};

CumulativeTemporalView_Day.width      = myDiv_TotalCumulativeTemporalView.clientWidth*0.3;//myDiv_CumulativeTemporalView_Day.clientWidth;
CumulativeTemporalView_Day.height     = myDiv_TotalCumulativeTemporalView.clientHeight;//myDiv_CumulativeTemporalView_Day.clientHeight;
//myDiv_TotalCumulativeTemporalView.clientWidth*0.40
//myDiv_TotalCumulativeTemporalView.clientHeight;//m
//GlobalCumulativeTemporalView.Graph.
CumulativeTemporalView_Day.xScale = d3.scaleBand().padding(0.2);
CumulativeTemporalView_Day.yScale = d3.scaleLinear();

CumulativeTemporalView_Day.svg = GlobalCumulativeTemporalView.Graph.append('g')
                             .attr('class', 'barchart')
                             //.attr("transform", "translate(" + myDiv_TotalCumulativeTemporalView.clientWidth*0.4+CumulativeTemporalView_Day.margin.left + "," + CumulativeTemporalView_Day.margin.top + ")");
                             .attr("transform", "translate(" + myDiv_TotalCumulativeTemporalView.clientWidth*0.5+CumulativeTemporalView_Day.margin.left + "," + CumulativeTemporalView_Day.margin.top + ")");

//CumulativeTemporalView_Day.svg.append("rect").attr("x",0).attr("y",0).attr("width",CumulativeTemporalView.width).attr("height",CumulativeTemporalView.height).attr("fill","green").attr("fill-opacity",0.5);
CumulativeTemporalView_Day.svg.append("g").attr("class", "barGraph");
CumulativeTemporalView_Day.svg.append("g").attr("class", "secondGraph");
CumulativeTemporalView_Day.svg.append("g").attr("class", "x axis");
CumulativeTemporalView_Day.svg.append("g").attr("class", "y axis");

function CumulativeTemporalView_Day_Init(){
  CumulativeTemporalView_Day.svg.select(".barGraph").selectAll("*").remove();
  CumulativeTemporalView_Day.svg.select(".secondGraph").selectAll("*").remove();
  CumulativeTemporalView_Day.svg.select(".x.axis").selectAll("*").remove();
  CumulativeTemporalView_Day.svg.select(".y.axis").selectAll("*").remove();
}

function CrearCumulativeTemporalView_Day(group, area, nest){
      var data    = nest.map(function(d, i) {return [d.key, d.value];   });
      innerWidth  = CumulativeTemporalView_Day.width - CumulativeTemporalView_Day.margin.right,
      innerHeight = CumulativeTemporalView_Day.height - CumulativeTemporalView_Day.margin.top - CumulativeTemporalView_Day.margin.bottom,


      //CumulativeTemporalView_Day.xScale.rangeRound([0, innerWidth]).domain(data.map(function(d){return d[0];}));
      CumulativeTemporalView_Day.xScale
                                .rangeRound([CumulativeTemporalView_Day.margin.left, innerWidth])
                                .domain(DayLabels);

      CumulativeTemporalView_Day.yScale.rangeRound([innerHeight, 0])
                        .domain([0,d3.max(data, function(d){return d[1];})]);

      CumulativeTemporalView_Day.svg.select(".x.axis")
            .attr("transform", "translate(0," + innerHeight + ")")
            .call(d3.axisBottom(CumulativeTemporalView_Day.xScale))
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });

      CumulativeTemporalView_Day.svg.select(".y.axis")
          .attr("transform", "translate("+CumulativeTemporalView_Day.margin.left+",0)")
          .call(d3.axisLeft(CumulativeTemporalView_Day.yScale).ticks(5))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Frequency");

      var mybars=CumulativeTemporalView_Day.svg.select(".barGraph")
            .append("g")
            .attr('width', innerWidth)
            .attr('height', innerHeight);

       var bars = mybars.selectAll('bar')
                .data(data)
                .enter()
                .append('rect')
                .attr("x", function(d){
                  return CumulativeTemporalView_Day.xScale(d[0]);
                })
                .attr("y", function(d){
                  return CumulativeTemporalView_Day.yScale(d[1]);
                })
                .attr("width", CumulativeTemporalView_Day.xScale.bandwidth())
                .attr("height", function(d) { 
                    return innerHeight+0.5 - CumulativeTemporalView_Day.yScale(d[1]); 
                  })
                .attr("class","barTemporalSerie");
                //.attr("fill","none")
                //.attr("stroke","grey");
              //.on("mouseover", onMouseOver)
              //.on("mouseout", onMouseOut);

}

var updateCumulativeView_Day = function updateCumulativeView_Day(group, area, nest) {
    var data = nest.map(function(d, i) {
           return [d.key, d.value-10];
      }); 

    CumulativeTemporalView_Day.svg.select(".secondGraph").selectAll('bars')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'barOverlap')
                .attr("x", function(d){
                      return CumulativeTemporalView_Day.xScale(d[0]);
                })
                .attr("y", function(d){
                      return CumulativeTemporalView_Day.yScale(d[1]);
                })
                .attr("width", CumulativeTemporalView_Day.xScale.bandwidth())
                .attr("height", function(d) { 
                      return innerHeight+0.5 - CumulativeTemporalView_Day.yScale(d[1]); 
                  });
}

var updateCumulativeView_DayRemove = function updateCumulativeView_DayRemove(){
    CumulativeTemporalView_Day.svg.select(".secondGraph").selectAll('.barOverlap').remove();
}

function updateCumulative_Day(data){
  updateCumulativeView_Day(CumulativeTemporalView_Day.svg,null,data);
}


/**************************************************************************************************************************/
/**************************************************************************************************************************/
/**************************************************************************************************************************/
/*------------------------------------------------------------------------------------*/
/*                  Cumulative Temporal View Period*/
/*------------------------------------------------------------------------------------*/

var CumulativeTemporalView_Period={};
var myDiv_CumulativeTemporalView_Period  = document.getElementById("cumulativeBarChart_Period");
//CumulativeTemporalView_Period.Graph    = d3.select("#cumulativeBarChart_Period").append("svg").attr("width",myDiv_CumulativeTemporalView_Period.clientWidth);

CumulativeTemporalView_Period.margin     = {top: 10, right: 10, bottom: 30, left: 35};
CumulativeTemporalView_Period.width      = myDiv_TotalCumulativeTemporalView.clientWidth*0.2;//myDiv_CumulativeTemporalView_Period.clientWidth;
CumulativeTemporalView_Period.height     = myDiv_TotalCumulativeTemporalView.clientHeight;//myDiv_CumulativeTemporalView_Period.clientHeight;

//myDiv_TotalCumulativeTemporalView.clientWidth*0.40
//myDiv_TotalCumulativeTemporalView.clientHeight;//m
//GlobalCumulativeTemporalView.Graph.

CumulativeTemporalView_Period.xScale = d3.scaleBand().padding(0.2);
CumulativeTemporalView_Period.yScale = d3.scaleLinear();

CumulativeTemporalView_Period.svg = GlobalCumulativeTemporalView.Graph.append('g')
                             .attr('class', 'barchart')
                             .attr("transform", "translate(" + myDiv_TotalCumulativeTemporalView.clientWidth*0.8+CumulativeTemporalView_Period.margin.left + "," + CumulativeTemporalView_Period.margin.top + ")");

//CumulativeTemporalView_Period.svg.append("rect").attr("x",0).attr("y",0).attr("width",CumulativeTemporalView_Period.width).attr("height",CumulativeTemporalView_Period.height).attr("fill","orange").attr("fill-opacity",0.5);;
CumulativeTemporalView_Period.svg.append("g").attr("class", "barGraph");
CumulativeTemporalView_Period.svg.append("g").attr("class", "secondGraph");
CumulativeTemporalView_Period.svg.append("g").attr("class", "x axis");
CumulativeTemporalView_Period.svg.append("g").attr("class", "y axis");

function CumulativeTemporalView_Period_Init(){
      CumulativeTemporalView_Period.svg.select(".barGraph").selectAll("*").remove();
      CumulativeTemporalView_Period.svg.select(".secondGraph").selectAll("*").remove();
      CumulativeTemporalView_Period.svg.select(".x.axis").selectAll("*").remove();
      CumulativeTemporalView_Period.svg.select(".y.axis").selectAll("*").remove();
}

function CrearCumulativeTemporalView_Period(group, area, nest){
      var data    = nest.map(function(d, i) {return [d.key, d.value];   });
      innerWidth  = CumulativeTemporalView_Period.width  -  CumulativeTemporalView_Period.margin.right,
      innerHeight = CumulativeTemporalView_Period.height - CumulativeTemporalView_Period.margin.top  - CumulativeTemporalView_Period.margin.bottom,


      //CumulativeTemporalView_Period.xScale.rangeRound([0, innerWidth]).domain(data.map(function(d){return d[0];}));
      CumulativeTemporalView_Period.xScale
                                    .rangeRound([CumulativeTemporalView_Period.margin.left, innerWidth])
                                    .domain(PeriodLabels);

      CumulativeTemporalView_Period.yScale.rangeRound([innerHeight, 0])
                        .domain([0,d3.max(data, function(d){return d[1];})]);

      CumulativeTemporalView_Period.svg.select(".x.axis")
            .attr("transform", "translate(0," + innerHeight + ")")
            .call(d3.axisBottom(CumulativeTemporalView_Period.xScale))
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });

      CumulativeTemporalView_Period.svg.select(".y.axis")
        .attr("transform", "translate("+CumulativeTemporalView_Period.margin.left+",0)")
          .call(d3.axisLeft(CumulativeTemporalView_Period.yScale).ticks(5))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Frequency");

      var mybars=CumulativeTemporalView_Period.svg.select(".barGraph")
            .append("g")
            .attr('width', innerWidth)
            .attr('height', innerHeight);

       var bars = mybars.selectAll('bar')
                .data(data)
                .enter()
                .append('rect')
                .attr("x", function(d){
                  return CumulativeTemporalView_Period.xScale(d[0]);
                })
                .attr("y", function(d){
                  return CumulativeTemporalView_Period.yScale(d[1]);
                })
                .attr("width", CumulativeTemporalView_Period.xScale.bandwidth())
                .attr("height", function(d) { 
                    return innerHeight+0.5 - CumulativeTemporalView_Period.yScale(d[1]); 
                  })
                .attr("class","barTemporalSerie");
}

var updateCumulativeView_Period = function updateCumulativeView_Period(group, area, nest) {
    var data = nest.map(function(d, i) {
           return [d.key, d.value-10];
      }); 

    CumulativeTemporalView_Period.svg.select(".secondGraph").selectAll('bars')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'barOverlap')
                .attr("x", function(d){
                      return CumulativeTemporalView_Period.xScale(d[0]);
                })
                .attr("y", function(d){
                      return CumulativeTemporalView_Period.yScale(d[1]);
                })
                .attr("width", CumulativeTemporalView_Period.xScale.bandwidth())
                .attr("height", function(d) { 
                      return innerHeight+0.5 - CumulativeTemporalView_Period.yScale(d[1]); 
                  });
}

var updateCumulativeView_PeriodRemove = function updateCumulativeView_PeriodRemove(){
    CumulativeTemporalView_Period.svg.select(".secondGraph").selectAll('.barOverlap').remove();
}

function updateCumulative_Period(data){
  updateCumulativeView_Period(CumulativeTemporalView_Period.svg,null,data);
}
/**************************************************************************************************************************/
/**************************************************************************************************************************/
/**************************************************************************************************************************/

/*****************************************************************************/
/*                          Ranking Type View */
/****************************************************************************/

var RankingTypeView       = {};
RankingTypeView.margin    = {top: 30, right: 200, bottom: 30, left: 200};
var div_RankingTypeView   = document.getElementById("rankingTypeView");
RankingTypeView.width     = div_RankingTypeView.clientWidth;// 1400,
RankingTypeView.height    = div_RankingTypeView.clientHeight//5*30;
RankingTypeView.Graph     = d3.select("#rankingTypeView").append("svg").attr("width", RankingTypeView.width).attr("height", RankingTypeView.height);
RankingTypeView.num       = 5;
RankingTypeView.radio     = 8;

  
RankingTypeView.svg= RankingTypeView.Graph.append("g")
          .attr("width", RankingTypeView.width)
          .attr("height", RankingTypeView.height)
          .attr("transform", "translate(" + RankingTypeView.margin.left + "," + RankingTypeView.margin.top + ")");;

  
RankingTypeView.xScale    = d3.scaleTime();
RankingTypeView.yScale    = d3.scaleLinear();
RankingTypeView.radioScale = d3.scaleLinear();
      
var colorRanking = d3.scaleOrdinal()
                  .range(["#DB7F85", "#50AB84", "#4C6C86", "#C47DCB", "#B59248", "#DD6CA7", "#E15E5A", "#5DA5B3", "#725D82", "#54AF52", "#954D56", "#8C92E8", "#D8597D", "#AB9C27", "#D67D4B", "#D58323", "#BA89AD", "#357468", "#8F86C2", "#7D9E33", "#517C3F", "#9D5130", "#5E9ACF", "#776327", "#944F7E"]);

RankingTypeView.svg.append("g").attr("class","bumpchart");
RankingTypeView.svg.append("g").attr("class","x axis");

var ribbon = d3.svgRibbon()
  .x(function(d) {return d.x})
  .y(function(d) {return d.y})
  .r(function(d) {return d.t});

function clean_RankingTypeView(){
  RankingTypeView.svg.select(".bumpchart").selectAll("*").remove();
  RankingTypeView.svg.select(".x.axis").selectAll("*").remove();
}


var CreateRankingTypeView=function CreateRankingTypeView(group,area,data){
  clean_RankingTypeView();
  data.sort(function(a, b) { return a.date - b.date; });
  
  // nest by name and rank by total popularity
  var nested = d3.nest()
    .key(function(d) { return d.typeCrime; })
    .rollup(function(leaves) {
      return {
        data: leaves,
        sum: d3.sum(leaves, function(d) { return d.value; })
      };
    })
    .entries(data);
  
  var innerWidth= RankingTypeView.width-RankingTypeView.margin.right-RankingTypeView.margin.left;
  var innerHeight= RankingTypeView.height-RankingTypeView.margin.top-RankingTypeView.margin.bottom;
  
  RankingTypeView.xScale.domain(d3.extent(data, function(d){return d.date;})).range([0, innerWidth]);
  RankingTypeView.yScale = d3.scaleLinear().domain([0,RankingTypeView.num]).range([0,innerHeight])
  
  nested.sort(function(a, b) { return b.value.sum-a.value.sum;});
  
  var topnames = nested.slice(0,RankingTypeView.num).map(function(d,i) { if(i<5){return d.key; }});
  
  data = data.filter(function(d) { return topnames.indexOf(d.typeCrime) > -1;});
  
  RankingTypeView.radioScale.domain(d3.extent(data, function(d){return d.value;})).range([1,RankingTypeView.radio])
  
  var byYear={};
  var intermedio=d3.nest()
        .key(function(d) { return d.date; })
        .key(function(d) { return d.typeCrime; })
          .sortValues(function(a,b) { return a.value - b.value;  })
          .rollup(function(leaves,i) {
            return leaves[0].value;
        })
    .entries(data);
  


  intermedio.forEach(function(d) {
      byYear[d.key] = {};
      d.values.sort(function(a,b){return b.value-a.value;});
      d.values.forEach(function(name,i) {
      byYear[d.key][name.key] = i;
      });
    });
  


   nested.slice(0,RankingTypeView.num).reverse().forEach(function(name,i) {
      var yearspopular = name.value.data;
  
      var globalAlpha,strokeStyle,lineWidth ;

        globalAlpha = 0.85;
        strokeStyle = GRAPH.CrimeTypeScale(name.key);//colorRanking(name.key);
        lineWidth = 2.5;
        
        
      var radio=[];
      var points =[];
      yearspopular.forEach(function(d,j){
        points.push({x: RankingTypeView.xScale(d.date), y:RankingTypeView.yScale(byYear[yearspopular[j].date][name.key]), t: RankingTypeView.radioScale(yearspopular[j].value)})
      });
  
    RankingTypeView.svg.select('.bumpchart')
      .append("path")
      .attr("id",function(f){
          temp=name.key.split(' ').join('');
          return "bumpchart_"+temp.split('.').join('');})
      .attr("fill", GRAPH.CrimeTypeScale(name.key))//colorRanking(name.key))
      .attr("class","bumpchart")
      .attr("stroke", GRAPH.CrimeTypeScale(name.key))//colorRanking(name.key))
      .attr("stroke-width", "1px")
      .attr("d", ribbon(points));
    
      
    var start = yearspopular[0].date;
    
    RankingTypeView.svg.select('.bumpchart').append("text")
        .attr("x", function(d) { return RankingTypeView.xScale(start)-4; })
        .attr("y", function(d) { return RankingTypeView.yScale(byYear[start][name.key]); })
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill",strokeStyle)
        .attr("fill-opacity",1)
        .attr("stroke-opacity",1)
        .text(function(){return name.key;});
    
    var end= yearspopular[yearspopular.length-1].date;
    
    RankingTypeView.svg.select('.bumpchart').append("text")
        .attr("x", function(d) { return RankingTypeView.xScale(end)+4; })
        .attr("y", function(d) { return RankingTypeView.yScale(byYear[end][name.key]); })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill",strokeStyle)
        .attr("fill-opacity",1)
        .attr("stroke-opacity",1)
        .text(function(){return name.key;});
      
  });
  
  RankingTypeView.svg.select(".x.axis")
  .attr("transform", "translate(0," + (innerHeight) + ")")
  .call(d3.axisBottom(RankingTypeView.xScale).tickSize(6, 0));
}


/**************************************************************************************/
var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
var Months=["jan","feb","mar","apr","may","jun","jul","aug","sept","oct","nov","dec"];

var RankingTypeViewSunBarChart          = {};
var myDiv_RankingTypeViewSunBarChart    = document.getElementById("sunBarChart");
RankingTypeViewSunBarChart.anglePadding = 0.05;

RankingTypeViewSunBarChart.width  = myDiv_RankingTypeViewSunBarChart.clientWidth,
RankingTypeViewSunBarChart.height = myDiv_RankingTypeViewSunBarChart.clientHeight,
RankingTypeViewSunBarChart.number = 5;

RankingTypeViewSunBarChart.individualDiv=(myDiv_RankingTypeViewSunBarChart.clientWidth/RankingTypeViewSunBarChart.number)-5;

var arc = d3.arc();
var p   = Math.PI*2;
var projection = d3.geoMercator().scale(1);
var path = d3.geoPath().projection(projection);

RankingTypeViewSunBarChart.Radio        = 100;
RankingTypeViewSunBarChart.innerRadius  = 50;
RankingTypeViewSunBarChart.barHeight    = RankingTypeViewSunBarChart.Radio;
RankingTypeViewSunBarChart.labelRadius  = RankingTypeViewSunBarChart.barHeight * 1.025;

function CreateSunBarChartTypeView(misDatos){
    misDatos.forEach(function(g){g.year=(g.date).getFullYear();});
    var temp = d3.nest()
       .key(function(r){return r.crimeType})
       .entries(misDatos);

    temp.sort(function(a,b){return b.values.length-a.values.length});
    var num=RankingTypeViewSunBarChart.number;
    var topnames = temp.slice(0,num).map(function(d,i) { if(i<num){ return d.key; }  });

    misDatos=misDatos.filter(function(d) { return (topnames.indexOf(d.crimeType) > -1); });

    data = d3.nest()
         .key(function(f){return f.year;})
          .key(function(d){return d.crimeType;})
            .key(function(d){return d.labelMonth;})
         .entries(misDatos);

    var maximo=d3.max(data,function(d){ return d3.max(d.values,function(f){return d3.max(f.values,function(g){return g.values.length;});})});

    RankingTypeViewSunBarChart.Scale=d3.scaleLinear().domain([0, maximo]).range([RankingTypeViewSunBarChart.innerRadius,RankingTypeViewSunBarChart.Radio]);

    var Second_data = d3.nest()
             .key(function(f){return f.crimeType;})
             .key(function(d){return d.year;})
             .key(function(d){return d.labelMonth;}).entries(misDatos);
             
    Second_data.sort(function(a,b){return topnames.indexOf(b.key)-topnames.indexOf(a.key);})

    var scaleCenter = calculateScaleCenter_SmallMultiples(SetoresList,2*RankingTypeViewSunBarChart.innerRadius,2*RankingTypeViewSunBarChart.innerRadius);
    
    projection.scale(scaleCenter.scale)
      .center(scaleCenter.center)
      .translate([RankingTypeViewSunBarChart.innerRadius , RankingTypeViewSunBarChart.innerRadius ]);

    visualize(Second_data,SetoresList);
}

function visualize(data,states){
  var visualizationWrapper = d3.select('#sunBarChart');
  data.slice().reverse().forEach(function(d,i){
      var wrapper = visualizationWrapper
        .append('div')
                    .style("width", RankingTypeViewSunBarChart.individualDiv + 'px')
          .style("height", RankingTypeViewSunBarChart.height + 'px')
          .attr('class',"block_crimetype");
      createSunChart(wrapper,d,states,GRAPH.CrimeTypeScale(d.key));
  });

  function createSunChart(wrapper,da,states,color){
          wrapper.append('p')
                .text(da.key.toLowerCase())
                .style("color",color)
              .attr("fill-opacity",1)
                .attr('class', 'legend');
                

            var svg = wrapper.append('svg')
                .attr("width", RankingTypeViewSunBarChart.individualDiv)
                .attr("height", RankingTypeViewSunBarChart.height);

      var mapsvg=svg.append("g").attr("transform", "translate(" + (RankingTypeViewSunBarChart.individualDiv/2-RankingTypeViewSunBarChart.innerRadius) + "," + (RankingTypeViewSunBarChart.height/2-RankingTypeViewSunBarChart.innerRadius) + ")");

       mapsvg.selectAll('path_map')
                .data(states.features)
                .enter()
                .append('path')
                .attr('opacity', "0.3")

                .attr('fill',color)
                .attr('stroke',color)
                .attr('d', path);

            var labels = svg.append("g")
                  .attr("transform", "translate(" + RankingTypeViewSunBarChart.individualDiv/2 + "," + RankingTypeViewSunBarChart.height/2 + ")");

            labels.append("def")
            .append("path")
            .attr("id", "label-path")
            .attr("d", "m0 " + -RankingTypeViewSunBarChart.labelRadius + " a" + RankingTypeViewSunBarChart.labelRadius + " " + RankingTypeViewSunBarChart.labelRadius + " 0 1,1 -0.01 0");

          labels.selectAll("text")
            .data(da.values)
          .enter().append("text")
            .style("text-anchor", "middle")
            .style("font-weight","bold")
            .style("fill", "#3e3e3e")
            .append("textPath")
            .attr("xlink:href", "#label-path")
            .attr("startOffset", function(d, i) { 
              return i * 100 / da.values.length + 50 / da.values.length + '%';
            })
            .text(function(d) {return d.key; });

            group=svg.append("g")
          .attr("transform", "translate(" + RankingTypeViewSunBarChart.individualDiv/2 + "," + RankingTypeViewSunBarChart.height/2 + ")");

      group.selectAll("path")
          .data(da.values)
          .enter()
          .append("path")
          .attr("fill","none")
          .attr("stroke",color)
          .attr("stroke-opacity",1)
          .attr("stroke-width",0.3)
          .attr("d",function(d,i){
            var secondStart=i*Math.PI*2/da.values.length+RankingTypeViewSunBarChart.anglePadding;
            var secondEnd=(i+1)*Math.PI*2/da.values.length-RankingTypeViewSunBarChart.anglePadding;

            drawIndividualYears(d.values,color,secondStart,secondEnd,group);

            return arc
                 .innerRadius(RankingTypeViewSunBarChart.innerRadius)
                 .outerRadius(RankingTypeViewSunBarChart.Radio)
                 .startAngle(secondStart)
                 .endAngle(secondEnd)(d);
                 
      });

      
  }
}

 function calculateScaleCenter_SmallMultiples(features,iWidth,iHeight) {
        var bbox_path = path.bounds(features),
          scale = 0.95 / Math.max(
          (bbox_path[1][0] - bbox_path[0][0]) / iWidth,//(2*secondinnerRadius),
          (bbox_path[1][1] - bbox_path[0][1]) /iHeight//(2*secondinnerRadius)
          );

        // Get the bounding box of the features (in map units!) and use it
        // to calculate the center of the features.
        var bbox_feature = d3.geoBounds(features),
          center = [
          (bbox_feature[1][0] + bbox_feature[0][0]) / 2,
          (bbox_feature[1][1] + bbox_feature[0][1]) / 2];

        return {
        'scale': scale,
        'center': center
        };
  } 


  function drawIndividualYears(datus,color,startAngle,endAngle,group){
  datus.sort(function(a,b){return Months.indexOf(a.key)-Months.indexOf(b.key);})
  p=endAngle-startAngle;
  
  group.selectAll("paths")
  .data(datus)
  .enter()
  .append("path")
    .attr("fill",color)
    .attr("opacity",0.3)
    .attr("stroke",color)
    .attr("stroke-opacity",1)
    .attr("stroke-width",1.5)
    .attr("d",function(d,i){
      return arc
           .innerRadius(RankingTypeViewSunBarChart.innerRadius)
           .outerRadius(function(){return RankingTypeViewSunBarChart.Scale(d.values.length);})
           .startAngle(function(){return startAngle+i*p/12})
           .endAngle(function(){return startAngle+(i+1)*p/12})(d);
    });
}


/*------------------------ END RANKING TYPE VIEW --------------------------------------*/
/*-------------------------------------------------------------------------------------*/
/*------------------------ START MAKING GRAPHS-----------------------------------------*/
function makeGraphs(){
    CreateGlobalTemporalView(GlobalTemporalView.svg,latArea,Data_GlobalTemporalView);

    CrearCumulativeTemporalView(CumulativeTemporalView.svg,null, Data_CumulativeTemporalView_Month);
    CrearCumulativeTemporalView_Day(CumulativeTemporalView_Day.svg,null,Data_CumulativeTemporalView_Day);
    CrearCumulativeTemporalView_Period(CumulativeTemporalView_Day.svg,null,Data_CumulativeTemporalView_Period);

    //JoyChart
    MakeTemporalCrimeTypeView(TotalData);
    //MakeTemporalSiteView(TotalData);
    
}
/*
function MakeTemporalSiteView(data){
    var temp=d3.nest()
            .key(function(f){return f.code;})
            .key(function(d){return d.date;})
            .rollup(function(leaves){return leaves.length}).entries(data);

    array=[];
    temp.forEach(function(d){
      d.values.forEach(function(g){
         array.push({"code":d.key,"date":new Date(g.key),"value":g.value})
      })
    });
    CreateTemporalSiteView(TemporalTypeView.svg,areaSite,array);
}*/

function MakeTemporalCrimeTypeView(data){
    /*begin pre processing missing values*/
    let temp=d3.nest()
            .key(function(f){return f.crimeType;})
            .key(function(d){return new Date(d.date);})
            .rollup(function(leaves){return leaves.length}).entries(data);

    array=[];
  
    temp.forEach(function(d){
        csData.time.all().forEach(function(cs){
           let index=arrayObjectIndexOf_Date(d.values,cs.key,"key") ;
           if(index<0){
             array.push({"typeCrime":d.key,"date":cs.key,"value":0});
           }
        })
          d.values.forEach(function(g){
             array.push({"typeCrime":d.key,"date":new Date(g.key),"value":g.value})
          })
    });
    /* end pre processing missing values*/
    //CreateTemporalTypeView(TemporalTypeView.svg,areaType,array);
    CreateRankingTypeView(RankingTypeView.svg,RankingTypeView.svg,array);
    CreateSunBarChartTypeView(data);
}
/*
function MakeTemporalSiteView_Hotspot(data){
     CreateTemporalSiteView(TemporalTypeView.svg,areaSite,data);
} */

function MakeTemporalCrimeTypeView_Hotspot(data){
      CreateRankingTypeView(RankingTypeView.svg,RankingTypeView.svg,data)
}

/**********************************************************************************************************/
/**********************************************************************************************************/
/**********************************************************************************************************/
