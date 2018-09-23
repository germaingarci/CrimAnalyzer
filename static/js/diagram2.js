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

var myDiv_TotalCumulativeTemporalView =  document.getElementById("Total_Cumulative_BarChart");


/*------------------------------------------------------------------------------------*/
/*                  Cumulative Temporal View*/
/*------------------------------------------------------------------------------------*/
var CumulativeTemporalView={};
var myDiv_CumulativeTemporalView  = document.getElementById("cumulativeBarChart");
CumulativeTemporalView.Graph      = d3.select("#cumulativeBarChart").append("svg").attr("width",myDiv_CumulativeTemporalView.clientWidth);

CumulativeTemporalView.margin     = {top: 10, right: 10, bottom: 25, left: 35};
CumulativeTemporalView.width      = myDiv_CumulativeTemporalView.clientWidth;
CumulativeTemporalView.height     = myDiv_CumulativeTemporalView.clientHeight;

CumulativeTemporalView.xScale     = d3.scaleBand().padding(0.1);
CumulativeTemporalView.yScale     = d3.scaleLinear();

CumulativeTemporalView.svg = CumulativeTemporalView.Graph.append('g')
                             .attr('class', 'barchart')
                             .attr("transform", "translate(" + CumulativeTemporalView.margin.left + "," + CumulativeTemporalView.margin.top + ")");


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
      innerWidth = CumulativeTemporalView.width - CumulativeTemporalView.margin.left - CumulativeTemporalView.margin.right,
      innerHeight = CumulativeTemporalView.height - CumulativeTemporalView.margin.top - CumulativeTemporalView.margin.bottom,


      //CumulativeTemporalView.xScale.rangeRound([0, innerWidth]).domain(data.map(function(d){return d[0];}));

      CumulativeTemporalView.xScale
                    .rangeRound([0, innerWidth])
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
                .attr("class","globalTemporalSerie");
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
var myDiv_CumulativeTemporalView_Day  = document.getElementById("cumulativeBarChart_Day");
CumulativeTemporalView_Day.Graph    = d3.select("#cumulativeBarChart_Day").append("svg").attr("width",myDiv_CumulativeTemporalView_Day.clientWidth);

CumulativeTemporalView_Day.margin     = {top: 10, right: 10, bottom: 25, left: 35};
CumulativeTemporalView_Day.width      = myDiv_CumulativeTemporalView_Day.clientWidth;
CumulativeTemporalView_Day.height     = myDiv_CumulativeTemporalView_Day.clientHeight;

CumulativeTemporalView_Day.xScale = d3.scaleBand().padding(0.1);
CumulativeTemporalView_Day.yScale = d3.scaleLinear();

CumulativeTemporalView_Day.svg = CumulativeTemporalView_Day.Graph.append('g')
                             .attr('class', 'barchart')
                             .attr("transform", "translate(" + CumulativeTemporalView_Day.margin.left + "," + CumulativeTemporalView_Day.margin.top + ")");


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
      innerWidth  = CumulativeTemporalView_Day.width - CumulativeTemporalView_Day.margin.left - CumulativeTemporalView_Day.margin.right,
      innerHeight = CumulativeTemporalView_Day.height - CumulativeTemporalView_Day.margin.top - CumulativeTemporalView_Day.margin.bottom,


      //CumulativeTemporalView_Day.xScale.rangeRound([0, innerWidth]).domain(data.map(function(d){return d[0];}));
      CumulativeTemporalView_Day.xScale
                                .rangeRound([0, innerWidth])
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
                .attr("class","globalTemporalSerie");
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
CumulativeTemporalView_Period.Graph    = d3.select("#cumulativeBarChart_Period").append("svg").attr("width",myDiv_CumulativeTemporalView_Period.clientWidth);

CumulativeTemporalView_Period.margin     = {top: 10, right: 10, bottom: 25, left: 35};
CumulativeTemporalView_Period.width      = myDiv_CumulativeTemporalView_Period.clientWidth;
CumulativeTemporalView_Period.height     = myDiv_CumulativeTemporalView_Period.clientHeight;

CumulativeTemporalView_Period.xScale = d3.scaleBand().padding(0.1);
CumulativeTemporalView_Period.yScale = d3.scaleLinear();

CumulativeTemporalView_Period.svg = CumulativeTemporalView_Period.Graph.append('g')
                             .attr('class', 'barchart')
                             .attr("transform", "translate(" + CumulativeTemporalView_Period.margin.left + "," + CumulativeTemporalView_Period.margin.top + ")");


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
      innerWidth  = CumulativeTemporalView_Period.width  - CumulativeTemporalView_Period.margin.left - CumulativeTemporalView_Period.margin.right,
      innerHeight = CumulativeTemporalView_Period.height - CumulativeTemporalView_Period.margin.top  - CumulativeTemporalView_Period.margin.bottom,


      //CumulativeTemporalView_Period.xScale.rangeRound([0, innerWidth]).domain(data.map(function(d){return d[0];}));
      CumulativeTemporalView_Period.xScale
                                    .rangeRound([0, innerWidth])
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
                .attr("class","globalTemporalSerie");
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
/*------------------------------------------------------------------------------------*/
/*                  Temporal Type View*/
/*------------------------------------------------------------------------------------*/

var TemporalTypeView={};
var div_TemporalTypeView  = document.getElementById("temporalTypeView");

TemporalTypeView.Graph    = d3.select('#temporalTypeView').append("svg")
                            .attr("width",div_TemporalTypeView.clientWidth)
                            .attr("height",600);

TemporalTypeView.margin     = { top: 10, right: 50, bottom: 30, left: 250 };
TemporalTypeView.width      = div_TemporalTypeView.clientWidth;
TemporalTypeView.height     = 600;//div_TemporalTypeView.clientHeight;

TemporalTypeView.xScale = d3.scaleTime();
TemporalTypeView.yScale = d3.scaleLinear();

//var activity = function(d) { return d.key; };
TemporalTypeView.activityScale = d3.scaleBand();//.range([0, height]),
var activityValueType = function(d) { return TemporalTypeView.activityScale(d.key); };
//var activityAxis = d3.axisLeft(TemporalTypeView.activityScale);

TemporalTypeView.overlap= 0.6;

TemporalTypeView.svg = TemporalTypeView.Graph.append('g')
                             .attr('class', 'tamporalTypeView')
                             .attr("transform", "translate(" + TemporalTypeView.margin.left + "," + TemporalTypeView.margin.top + ")");
               
TemporalTypeView.svg.append("g").attr("class", "baseline");
TemporalTypeView.svg.append("g").attr("class", "activities");
TemporalTypeView.svg.append("g").attr("class", "x axis");
TemporalTypeView.svg.append("g").attr("class", "axis axis--x");
TemporalTypeView.svg.append("g").attr("class", "axis axis--activity");


var areaType = d3.area()
    .x(function(d){return TemporalTypeView.xScale(d.date);})
    .y1(function(d){return TemporalTypeView.yScale(d.value);})
  .curve(d3.curveBasis);

  
function CleanTemporalTypeView(){
  TemporalTypeView.svg.select(".baseline").selectAll("*").remove();
  TemporalTypeView.svg.select(".activities").selectAll("*").remove();
  TemporalTypeView.svg.select(".x.axis").selectAll("*").remove();
  TemporalTypeView.svg.select(".axis.axis--x").selectAll("*").remove();
  TemporalTypeView.svg.select(".axis.axis--activity").selectAll("*").remove();
}
var CreateTemporalTypeView=function CreateTemporalTypeView(group,area,data){
   CleanTemporalTypeView();
  data.sort(function(a, b) { return a.date - b.date; });
  
  var datanest = d3.nest()
      .key(function(d) { return d.typeCrime;/*.toLowerCase();*/ })
      .rollup(function(leaves){return {"values":leaves,"sum":d3.sum(leaves,function(d){return parseFloat(d.value);})}})
      .entries(data);
  
  datanest.sort(function(a, b) { return b.value.sum-a.value.sum;});

  TemporalTypeView.height=datanest.length*25;
  
  var innerWidth=TemporalTypeView.width-TemporalTypeView.margin.left - TemporalTypeView.margin.right;
  var innerHeight=TemporalTypeView.height-TemporalTypeView.margin.top - TemporalTypeView.margin.bottom;
  
  TemporalTypeView.xScale.domain(d3.extent(data, function(d){return d.date;})).range([0, innerWidth]);
  
  TemporalTypeView.activityScale.domain(datanest.map(function(d) { return d.key; })).range([0, innerHeight]);
  
  var areaChartHeight = (1 + TemporalTypeView.overlap) * (innerHeight / TemporalTypeView.activityScale.domain().length);
  
  TemporalTypeView.yScale
        .domain(d3.extent(data, function(d){return d.value}))
        .range([areaChartHeight, 0]);
  
  area.y0(TemporalTypeView.yScale(0));
  

    TemporalTypeView.svg.select('.axis.axis--activity')
        .call(d3.axisLeft(TemporalTypeView.activityScale))
  
  var ar=TemporalTypeView.svg.select('.baseline')
              .append("g");
              
  ar.selectAll("baseline")
        .data(datanest)
      .enter().append("line")
        .attr("class", "baseline")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", function(d) { 
      return (activityValueType(d)) + TemporalTypeView.activityScale.bandwidth(); })
        .attr("y2", function(d) { 
      return (activityValueType(d)) + TemporalTypeView.activityScale.bandwidth(); })
    .style("stroke","black");
    
  
  var gActivity = TemporalTypeView.svg.select('.activities')
            .selectAll('.activity').data(datanest)
        .enter().append('g')
            .attr('class', function(d) { return 'activity activity--' + d.key; })
            .attr('transform', function(d) {
                var ty = activityValueType(d) - TemporalTypeView.activityScale.bandwidth() + 5;
                return 'translate(0,' + ty + ')';
            });
  
  gActivity.append('path')
    .attr('class', function(d){ if(d.key.toLowerCase()==GRAPH.selectedCrimeType.toLowerCase()){return 'areaTypeSelected';}else{return 'areaType'}})
    .datum(function(d) {return d.value.values})
    .attr('d', area)
    .on("click",eventoClickCrimeType);

    gActivity.append('text')
            .attr('class', function(d) { return 'activity activity--' + d.key; })
            .attr("y",function(){return TemporalTypeView.yScale(0);})
            .attr("font-size", "12px")
              .attr("fill", "#777")
            .attr("x",function(){return innerWidth;})
            .text(function(d){return Math.floor(d.value.sum);});
  
  TemporalTypeView.svg.select(".axis.x")
    .attr("transform", "translate(0, " + (innerHeight - 2) + ")")
    .call(d3.axisBottom(TemporalTypeView.xScale).tickSize(6, 0))
     .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
          return "rotate(-65)" 
          }); 
}

function eventoClickCrimeType(d){
  if(GRAPH.selectedCrimeType.toLowerCase()==d[0].typeCrime.toLowerCase()){
    GRAPH.selectedCrimeType="";
    d3.select(this).attr("class","areaType");
    RankingTypeView.svg.selectAll("path").attr("class","bumpchart");
    //updateOverlapAreaRemove();
    //updateCumulativeViewRemove();
    UnselectedActionToCrimeType();
    
  }else{
    TemporalTypeView.svg.select(".activities").selectAll("path").attr("class","areaType");
     RankingTypeView.svg.selectAll("path").attr("class","bumpchart");


    var temp=d[0].typeCrime.split(' ').join('');
    d3.select("#bumpchart_"+temp.split('.').join('')).attr("class","bumpchartSelected");
    GRAPH.selectedCrimeType=d[0].typeCrime;
    d3.select(this).attr("class","areaTypeSelected");
    ActionToCrimeType(d[0].typeCrime);

    //updateOverlapAreaRemove();
    //updateOverlap();

    //updateCumulativeViewRemove();
    //updateCumulative();
  }
}



//joyChartdata.forEach(function(d){d.date=new Date(d.date);})
//CreateTemporalTypeView(TemporalTypeView.svg,areaType,joyChartdata);


/*------------------------------------------------------------------------------------*/
/*                  Temporal Site View*/
/*------------------------------------------------------------------------------------*/

var TemporalSiteView={};
var div_TemporalSiteView  = document.getElementById("temporalSiteView");

TemporalSiteView.Graph    = d3.select('#temporalSiteView').append("svg")
                            .attr("width",div_TemporalSiteView.clientWidth)
                            .attr("height",600);

TemporalSiteView.margin     = { top: 10, right: 50, bottom: 30, left: 120 };
TemporalSiteView.width      = div_TemporalSiteView.clientWidth;
TemporalSiteView.height     = 600;//div_TemporalSiteView.clientHeight;

TemporalSiteView.xScale = d3.scaleTime();
TemporalSiteView.yScale = d3.scaleLinear();

//var activity = function(d) { return d.key; };
TemporalSiteView.activityScale = d3.scaleBand();//.range([0, height]),
var activityValueSite = function(d) { return TemporalSiteView.activityScale(d.key); };
//var activityAxis = d3.axisLeft(TemporalSiteView.activityScale);

TemporalSiteView.overlap= 0.6;

TemporalSiteView.svg = TemporalSiteView.Graph.append('g')
                             .attr('class', 'tamporalTypeView')
                             .attr("transform", "translate(" + TemporalSiteView.margin.left + "," + TemporalSiteView.margin.top + ")");
               
TemporalSiteView.svg.append("g").attr("class", "baseline");
TemporalSiteView.svg.append("g").attr("class", "activities");
TemporalSiteView.svg.append("g").attr("class", "x axis");
TemporalSiteView.svg.append("g").attr("class", "axis axis--x");
TemporalSiteView.svg.append("g").attr("class", "axis axis--activity");

var areaSite = d3.area()
    .x(function(d){return TemporalSiteView.xScale(d.date);})
    .y1(function(d){return TemporalSiteView.yScale(d.value);})
  .curve(d3.curveBasis);
  
function clean_TemporalSiteView(){
    TemporalSiteView.svg.select(".baseline").selectAll("*").remove();
    TemporalSiteView.svg.select(".activities").selectAll("*").remove();
    TemporalSiteView.svg.select(".x.axis").selectAll("*").remove();
    TemporalSiteView.svg.select(".axis.axis--x").selectAll("*").remove();
    TemporalSiteView.svg.select(".axis.axis--activity").selectAll("*").remove();
}
var CreateTemporalSiteView=function CreateTemporalSiteView(group,area,data){
  clean_TemporalSiteView();
  data.sort(function(a, b) { return a.date - b.date; });
  
  var datanest = d3.nest()
      .key(function(d) { return d.code;/*.toLowerCase();*/ })
      .rollup(function(leaves){return {"values":leaves,"sum":d3.sum(leaves,function(d){return parseFloat(d.value);})}})
      .entries(data);
  
  datanest.sort(function(a, b) { return b.value.sum-a.value.sum;});
  
  TemporalSiteView.height=datanest.length*26;

  var innerWidth=TemporalSiteView.width-TemporalSiteView.margin.left - TemporalSiteView.margin.right;
  var innerHeight=TemporalSiteView.height-TemporalSiteView.margin.top - TemporalSiteView.margin.bottom;
  
  TemporalSiteView.xScale.domain(d3.extent(data, function(d){return d.date;})).range([0, innerWidth]);
  
  TemporalSiteView.activityScale.domain(datanest.map(function(d) { return d.key; })).range([0, innerHeight]);
  
  var areaChartHeight = (1 + TemporalSiteView.overlap) * (innerHeight / TemporalSiteView.activityScale.domain().length);
  
  TemporalSiteView.yScale
        .domain(d3.extent(data, function(d){return d.value}))
        .range([areaChartHeight, 0]);
  
  area.y0(TemporalSiteView.yScale(0));
  

    TemporalSiteView.svg.select('.axis.axis--activity')
        .call(d3.axisLeft(TemporalSiteView.activityScale))
  
  var ar=TemporalSiteView.svg.select('.baseline')
              .append("g");
              
  ar.selectAll("baseline")
        .data(datanest)
      .enter().append("line")
        .attr("class", "baseline")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", function(d) { 
      return (activityValueSite(d)) + TemporalSiteView.activityScale.bandwidth(); })
        .attr("y2", function(d) { 
      return (activityValueSite(d)) + TemporalSiteView.activityScale.bandwidth(); })
    .style("stroke","black");
    
  
  var gActivity = TemporalSiteView.svg.select('.activities')
            .selectAll('.activity').data(datanest)
        .enter().append('g')
            .attr('class', function(d) { return 'activity activity--' + d.key; })
            .attr('transform', function(d) {
                var ty = activityValueSite(d) - TemporalSiteView.activityScale.bandwidth() + 5;
                return 'translate(0,' + ty + ')';
            });
  
  gActivity.append('path')
        .attr("id",function(d){
            return "temporalSiteView_"+d.key;
          })
        .attr('class', function(d){ if(d.key.toLowerCase()==GRAPH.SelectedSite.toLowerCase()){return 'areaSiteSelected';}else{return 'areaSite'}})
    .datum(function(d) {return d.value.values})
        .attr('d', area)
    .on("click",eventoClickSite);

    gActivity.append('text')
            .attr('class', function(d) { return 'activity activity--' + d.key; })
            .attr("y",function(){return TemporalSiteView.yScale(0);})
            .attr("font-size", "12px")
              .attr("fill", "#777")
            .attr("x",function(){return innerWidth;})
            .text(function(d){return Math.floor(d.value.sum);});
  
  TemporalSiteView.svg.select(".axis.x")
    .attr("transform", "translate(0, " + (innerHeight - 2) + ")")
    .call(d3.axisBottom(TemporalSiteView.xScale).tickSize(6, 0))
     .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
          return "rotate(-65)" 
          }); 
}

function eventoClickSite(d){
  if(GRAPH.SelectedSite.toLowerCase()==d[0].code.toLowerCase()){
    GRAPH.SelectedSite="";
    d3.select(this).attr("class","areaSite");
    
    //updateOverlapAreaRemove();
    //updateCumulativeViewRemove();
    UnselectedActionToCensusBlock();

  }else{
    TemporalSiteView.svg.select(".activities").selectAll("path").attr("class","areaSite");
    GRAPH.SelectedSite=d[0].code;
    d3.select(this).attr("class","areaSiteSelected");
    ActionToCensusBlock(d[0].code);
    //updateOverlapAreaRemove();
    //updateOverlap();

    //updateCumulativeViewRemove();
    //updateCumulative();
  }
}

//CreateTemporalSiteView(TemporalTypeView.svg,areaType,joyChartdata);


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
  
  /* ------------------------ Complete Intermedio ----------------------------------*/
  /*topnames.forEach(function(d){
      intermedio.forEach(function(g){
          if(arrayObjectIndexOf(g.values,d,"key")<0){
            g.values.push({"key":d,"value":0});
          }
        });
  });*/


  /* ------------------------ Complete Intermedio ----------------------------------*/


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
        strokeStyle = colorRanking(name.key);
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
      .attr("fill", colorRanking(name.key))
      .attr("class","bumpchart")
      .attr("stroke", colorRanking(name.key))
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

/*-------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------*/
function makeGraphs(){
    CreateGlobalTemporalView(GlobalTemporalView.svg,latArea,Data_GlobalTemporalView);

    CrearCumulativeTemporalView(CumulativeTemporalView.svg,null, Data_CumulativeTemporalView_Month);
    CrearCumulativeTemporalView_Day(CumulativeTemporalView_Day.svg,null,Data_CumulativeTemporalView_Day);
    CrearCumulativeTemporalView_Period(CumulativeTemporalView_Day.svg,null,Data_CumulativeTemporalView_Period);

    //JoyChart
    MakeTemporalCrimeTypeView(TotalData);
    MakeTemporalSiteView(TotalData);
    
}

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
}

function MakeTemporalCrimeTypeView(data){
    /*let temp=d3.nest()
            .key(function(f){return f.crimeType;})
            .key(function(d){return d.date;})
            .rollup(function(leaves){return leaves.length}).entries(data);

    array=[];
    temp.forEach(function(d){
      d.values.forEach(function(g){
         array.push({"typeCrime":d.key,"date":new Date(g.key),"value":g.value})
      })
    });*/
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
    CreateTemporalTypeView(TemporalTypeView.svg,areaType,array);
    CreateRankingTypeView(RankingTypeView.svg,RankingTypeView.svg,array)
}

function MakeTemporalSiteView_Hotspot(data){
     CreateTemporalSiteView(TemporalTypeView.svg,areaSite,data);
} 

function MakeTemporalCrimeTypeView_Hotspot(data){
      CreateTemporalTypeView(TemporalTypeView.svg,areaType,data);
      CreateRankingTypeView(RankingTypeView.svg,RankingTypeView.svg,data)
}