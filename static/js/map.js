var csData;

var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

var MonthLabels  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var DayLabels    = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
var PeriodLabels = ["Mor","Aft","Eve",'Dawn'];


var GRAPH={};
    GRAPH.ColorPaletterName   = "interpolateYlOrBr";
    GRAPH.CategoricalColors=["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
    GRAPH.dateFmt             = d3.timeParse("%d-%m-%Y %H:%M:%S");
    GRAPH.dateFmtHotspot      = d3.timeParse("%Y-%m-%d %H:%M:%S");
    GRAPH.MaxCrimes           = 2;
    GRAPH.codSetorList        = [];
    GRAPH.SelectedSite        = "";
    GRAPH.selectedCrimeType   = "";
    GRAPH.MinIndividualDiv    = 250;
    GRAPH.ordinalMonthScale   = d3.scaleOrdinal().domain(MonthLabels).range([1,2,3,4,5,6,7,8,9,10,11, 12]);
    GRAPH.TopSelectedCrimeTypes = [];
    GRAPH.TopSelectedYears      = [];

 GRAPH.CrimeTypeScale = d3.scaleOrdinal()
    //.range(["#DB7F85", "#50AB84", "#4C6C86", "#C47DCB", "#B59248", "#DD6CA7", "#E15E5A", "#5DA5B3", "#725D82", "#54AF52", "#954D56", "#8C92E8", "#D8597D", "#AB9C27", "#D67D4B", "#D58323", "#BA89AD", "#357468", "#8F86C2", "#7D9E33", "#517C3F", "#9D5130", "#5E9ACF", "#776327", "#944F7E"]);
    .range(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]);

var svgMap;

var svgColor;
svgColor = d3.select("#color").append("svg")
            .attr("height",200);

GRAPH.target = document.getElementById('loadingdiv');
/*-----------------------SPIN-------------------------------*/
var opts = {
  lines   : 9,  // The number of lines to draw
  length  : 5,  // The length of each line
  width   : 3,  // The line thickness
  radius  : 6,  // The radius of the inner circle
  corners : 0.4,// Corner roundness (0..1)
  rotate  : 0,  // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color   : '#fff', // #rgb or #rrggbb or array of colors
  speed   : 0.9, // Rounds per second
  trail   : 73,  // Afterglow percentage
  shadow  : false,// Whether to render a shadow
  hwaccel : false,// Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex  : 2e9,  // The z-index (defaults to 2000000000)
  top     : '50%',// Top position relative to parent
  left    : '50%' // Left position relative to parent
};
var spinner = new Spinner(opts);

/*---------------------- MAP ------------------------------*/
var MAP={};
var OpenMapSurfer_Roads = L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

/*Outdoors*/
var Thunderforest_Outdoors = L.tileLayer('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}', {
  attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  apikey: '<your apikey>',
  maxZoom: 22
});

var Hydda_Full = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom:3
});



MAP.baseLayers = {"CartoDB_Positron":CartoDB_Positron,
                  "Hydda_Full": Hydda_Full,
                  "Thunder":Thunderforest_Outdoors,
                  "Open_Roads":OpenMapSurfer_Roads}

const map = new L.Map('map', {
    layers: [CartoDB_Positron],//[Hydda_Full],//[CartoDB_Positron],
    center: new L.LatLng(-23.548682,-46.634731), //centro do Sao Paulo
    zoom: 12,
});


const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
  position: 'topleft',
  draw: { 
      polyline: {metric: false},
      marker: true,
      circle: false,
      rectangle:false,
      polygon:false,
      resetview:false,
      editable: true,
  },
  edit: {
      featureGroup: drawnItems,
      remove: true,
      buffer: {replacePolylines: false,separateBuffer: false}
  },
});


map.addControl(drawControl);
L.control.groupedLayers(MAP.baseLayers, MAP.groupedOverlays,drawControl).addTo(map);

map.on('draw:created', (e) => {

     const {layerType, layer } = e;
     drawnItems.addLayer(layer);
      var type = e.layerType;
     if(type=='marker'){
        marker=e;
        QueryWithMarker(e.layer._latlng.lat,e.layer._latlng.lng);
        drawnItems.removeLayer(e.layer);
        map.removeLayer(e.layer);
     }
});

var marker;
map.on('draw:drawstart',(e)=>{
   var type = e.layerType;
   deleteElementsOfMap();
});

map.on('draw:bufferstart', (e) => { //modify the style of map layers
    for(i in map._layers) {
        if(map._layers[i]._path != undefined) {
            d3.select(map.getPanes().overlayPane).selectAll("#mapdiv").remove();
            map._layers[i].setStyle({opacity:0.5,fillOpacity:0.2});
        }
    }
});

map.on('draw:buffered', (e) => {
    spinner.spin(GRAPH.target);
    GRAPH.codSetorList   = [];
    var lats             = [],
        longs            = [],
        points           = [];
    poly2                = (Object.values(Object.values(e.layers)[0])[1])._latlngs;
    poly2.forEach(function(d){
                  points.push({x:parseFloat(d.lat),y:parseFloat(d.lng)});
                  });
    //Simple=simplify(points,0.0001); //reduce number of poinys
    for (var i = 0; i < points.length; i++) {
        //lats.push(Simple[i].x);longs.push(Simple[i].y);
        lats.push(points[i].x); longs.push(points[i].y);
    }

    $.ajax({
        data:{'lats':JSON.stringify(lats),'longs':JSON.stringify(longs)},
        url : '/setor_selected/',
        type: 'get',
        dataType : 'json',
        success : function(json) {
            spinner.stop();
            SetoresList = JSON.parse(json);
            clearAll();
            SetoresList['features'].forEach(function(d){  
                GRAPH.codSetorList.push(d.properties['codsetor']);
                d.properties.numcrimens=0.5; });
            drawLeafletMap(SetoresList);
            clearMap();
        }
    });

});


function drawLeafletMap(geoShape){
 
   svgMap = d3.select(map.getPanes()
            .overlayPane)
            .append("svg")
            .attr("id","mapdiv");

   g      = svgMap.append("g")
            .attr("class", "leaflet-zoom-hide");

   var colorScale = d3.scaleSequential(d3[GRAPH.ColorPaletterName])
                    .domain([0, GRAPH.MaxCrimes]);

    //  create a d3.geo.path to convert GeoJSON to SVG
    var transform   = d3.geoTransform({point: projectPoint}),
            path    = d3.geoPath().projection(transform);
 
    // create path elements for each of the features
    d3_features = g.selectAll("path")
                  .data(geoShape.features)
                  .enter().append("path");

    map.on("viewreset", reset);
    reset();
    // fit the SVG element to leaflet's map layer
    function reset() {        
        bounds          = path.bounds(geoShape);
        var topLeft     = bounds[0],
        bottomRight     = bounds[1];

        svgMap.attr("width", bottomRight[0] - topLeft[0])
              .attr("height", bottomRight[1] - topLeft[1])
              .style("left", topLeft[0] + "px")
              .style("top", topLeft[1] + "px");

        g.attr("transform", "translate(" + -topLeft[0] + "," 
                                          + -topLeft[1] + ")");
        // initialize the path data 
        d3_features.attr("d", path)
                   .style("fill-opacity", 0.8)
                   .attr("stdDeviation","3.5")
                   .attr('fill',function(d,i){
                        //style when is selected
                        if(d.properties.codsetor==GRAPH.SelectedSite || d.properties.codsetor==GRAPH.ClickadosSetores){
                            svgMap.append('defs')
                                  .append('pattern')
                                    .attr('id', 'diagonalHatch_'+i)
                                    .attr('patternUnits', 'userSpaceOnUse')
                                    .attr('width', 4)
                                    .attr('height', 4)
                                  .append('path')
                                    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
                                    .attr('stroke', function(){return colorScale(d.properties.numcrimens); })
                                    .attr('stroke-width', 2)
                          return 'url(#diagonalHatch_'+i+')';
                        }else{
                          if(GRAPH.MaxCrimes==2){ return "#97A8BE";}
                          return colorScale(d.properties.numcrimens);
                        }
          }) //aqui adicionar los colores
          //.attr('stroke','#636363')
          .attr('stroke','#3D4A57')
          .attr('stroke-width',1.5)
          .attr("stroke-linecap", "round")
          /*.on("click",function(d){
                     d3.selectAll(".clicked")
                          .classed("clicked", false)
                          .attr("fill", function(){
                                return colorScale(d.properties.numcrimens)
                          });

                      d3.select(this)
                          .classed("clicked", true)
                          .attr("fill", function(){
                                if(d.properties.codsetor==GRAPH.SiteSelected){
                                      return colorScale(d.properties.numcrimens);
                                }else{
                                      GRAPH.SiteSelected=d.properties.codsetor;
                                  return "blue";
                                }
                          })
          });*/
          .on('click',GeoMouseClick);

    } 
    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }
}

//click in each site
function GeoMouseClick(d){
    if(csData!=null){ // Check out that there are instances
        if(d.properties.codsetor!=GRAPH.SelectedSite){
            //updateEliminar();
             GRAPH.SelectedSite=d.properties.codsetor;
            //TemporalSiteView.svg.select(".activities").selectAll("path").attr("class","areaSite");
            d3.select("#temporalSiteView_"+GRAPH.SelectedSite).attr("class","areaSiteSelected");           
            ActionToCensusBlock(d.properties.codsetor); 

        }else{
            //TemporalSiteView.svg.select(".activities").selectAll("path").attr("class","areaSite");
            GRAPH.SelectedSite="";
            UnselectedActionToCensusBlock();
        }
    }
}


//get polygon with marker
function QueryWithMarker(lat,lng){
    $.ajax({
        data:{'lat':lat,'lng':lng},
        url : '/QueryWith_Marker/',
        type: 'get',
        dataType : 'json',
        success : function(json) {
          var myjson      = JSON.parse(json);
          points          =[];
          (myjson.features[0].geometry.coordinates[0][0]).forEach(function(d,i){
                                                                      points.push([d[1],d[0]]);
                                                                  });                
          var firstpolyline = new L.polyline(points).addTo(map);
          firstpolyline.addTo(drawnItems);
        }
    });
}


function HotspotDetection(){
}

function deleteElementsOfMap() {
    for(i in map._layers) {
        if(map._layers[i]._path != undefined ) {
            try {
                map.removeLayer(map._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + map._layers[i]);
            }
        }
    }
    if(marker!=undefined){map.removeLayer(marker);}
}

function clearAll(){

}

function clearMap() {
    for(i in map._layers) {
        if(map._layers[i]._path != undefined) {
                 map._layers[i].setStyle({opacity:0,fillOpacity:0});
        }
    }
}

function remakeGraph(){
    GRAPH.MaxCrimes=-1000;
    csData.Codes.all().forEach(function(d){
        GRAPH.MaxCrimes=Math.max(GRAPH.MaxCrimes,d.value);
        SetoresList.features.forEach(function(g){
            if(g.properties.codsetor==d.key){g.properties.numcrimens=d.value;}
        });
    });

    svgMap.selectAll("*").remove();
    drawLeafletMap(SetoresList);
    DrawColorPalette();
}

function DrawColorPalette(){
    svgColor.selectAll("*").remove();
    var colorScheme   = GRAPH.ColorPaletterName//"interpolateYlOrBr";
    var width         = 200;
    var widthLegend   = 20;
    var heightPalette = 190;

    var colorMapLegend = d3.scaleSequential()
            .domain([0,width])
            .interpolator(d3[colorScheme]);

    var y = d3.scaleLinear()
        .range([heightPalette, 0])
        .domain([0, GRAPH.MaxCrimes]);

    var numTicks;
    if (width >= 100) {
      numTicks = 10;
    } else if (width>=50 && width<100) {
      numTicks = 5;
    } else {
      numTicks = 3;
    };
    var yAxis = d3.axisRight()
      .ticks(numTicks)
      .scale(y);
    svgColor.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+widthLegend/2+"," + 5  + ")")
        .call(yAxis)            

    svgColor.selectAll(".bars")
        .append("g")
        .data(d3.range(heightPalette), function(d) { return d; })                    
        .enter().append("rect")
            .attr("class", "bars")
            .attr("x", -1)
            .attr("y", function(d, i) { return heightPalette-i+4; })
            .attr("height", 1)
            .attr("width", widthLegend/2)
            .style("fill", function(d, i ) { return colorMapLegend(d); })
}

//when a census block was clicked
function ActionToCensusBlock(codeSite){
   /*remove*/
   updateCumulativeViewRemove();
   updateCumulativeView_DayRemove();
   updateCumulativeView_PeriodRemove();

   updateOverlapAreaRemove();
   /*make*/
    GRAPH.SelectedSite=codeSite;
    csData.dimCode.filter(codeSite);
    remakeGraph();
    //overlap_GlobalTemporalView(csData.time.all());
    updateOverlap(csData.time.all());
    updateCumulative(csData.labelMonth.all());
    updateCumulative_Day(csData.labelDay.all());
    updateCumulative_Period(csData.labelPeriod.all());


    //action to rewrite TemporalTypeView
    temp=TotalData.filter(function(d){return d.code==codeSite});
    MakeTemporalCrimeTypeView(temp);

}

function UnselectedActionToCensusBlock(){
   GRAPH.SelectedSite="";
   csData.dimCode.filterAll();
   remakeGraph();

   updateCumulativeViewRemove();
   updateCumulativeView_DayRemove();
   updateCumulativeView_PeriodRemove();

   updateOverlapAreaRemove();

   if(GRAPH.selectedCrimeType!=""){
      updateOverlap(csData.time.all());
      updateCumulative(csData.labelMonth.all());
      updateCumulative_Day(csData.labelDay.all());
      updateCumulative_Period(csData.labelPeriod.all());
   }
   MakeTemporalCrimeTypeView(TotalData);
}
/*-------------------------------------------------------------------------*/
function ActionToCrimeType(codeType){
    /*remove*/
    updateCumulativeViewRemove();
    updateCumulativeView_DayRemove();
    updateCumulativeView_PeriodRemove();
    
    updateOverlapAreaRemove();
    /*make*/
    GRAPH.selectedCrimeType=codeType;
    csData.dimCrimeType.filter(codeType);
    remakeGraph();

    updateOverlap(csData.time.all());
    
    updateCumulative(csData.labelMonth.all());
    updateCumulative_Day(csData.labelDay.all());
    updateCumulative_Period(csData.labelPeriod.all());

    //temp=TotalData.filter(function(d){return d.crimeType==codeType});
    //MakeTemporalSiteView(temp);
}

function UnselectedActionToCrimeType(){
    GRAPH.selectedCrimeType="";
    csData.dimCrimeType.filterAll();
    remakeGraph();

    updateCumulativeViewRemove();
    updateCumulativeView_DayRemove();
    updateCumulativeView_PeriodRemove();

    updateOverlapAreaRemove();
    if(GRAPH.SelectedSite!=""){
        updateOverlap(csData.time.all());
        updateCumulative(csData.labelMonth.all());
        updateCumulative_Day(csData.labelDay.all());
        updateCumulative_Period(csData.labelPeriod.all());
    }
    //MakeTemporalSiteView(TotalData);
}

/*-------------------------------------------------***************************************************/
/*---------++++++++++++++++++++++++++++++++++++++++++++++++---- HOTSPOTS ----------------------------*/
/*-------------------------------------------------***************************************************/

function AddDivs(){
    GRAPH.divSeleccionado="";
    d3.select('#patternDiv').selectAll("*").remove();
    elementos=[];
    myDiv=document.getElementById("patternDiv");
    maior=document.getElementById("father");
    divWith=maior.clientWidth/GRAPH.numberOfHotspots;
    GRAPH.MinHeightDiv=maior.clientHeight/2;
    if(divWith>GRAPH.MinIndividualDiv){GRAPH.MinIndividualDiv=divWith;}
    for (i = 0;i<GRAPH.numberOfHotspots;i++) {
        var iDiv = document.createElement("div");
        iDiv.setAttribute("id","div_"+i);
        iDiv.setAttribute("class","block");
        iDiv.style.width =GRAPH.MinIndividualDiv-15+"px";
        iDiv.style.height =myDiv.clientHeight-15+"px";
        iDiv.style.justifyContent ="center";
       
        iDiv.style.borderColor="#1B2A3C";//GRAPH.CategoricalColors[i];
        iDiv.onclick=function(){clickIndividualHotspots(this);};
        elementos.push({"id":"div_"+i,"div":iDiv});
        myDiv.appendChild(iDiv);
        
    }
    GRAPH.patternDiv=elementos;
    DrawIndividualHotspots(SetoresList);
}

function cleanDivSelection(){
    var list = document.getElementById("patternDiv");
    for (child = list.firstChild; child; child = child.nextSibling) {
        if (child.nodeType == 1) { // 1 == Element
            child.setAttribute("class","block");
        }
    }
}

function clickIndividualHotspots(element){
    if(element.id==GRAPH.divSeleccionado){// is already selected
        GRAPH.IfHotspotSeleccionado=false;
        GRAPH.HotspotSeleccionado=-1;
        cleanDivSelection();

        GRAPH.divSeleccionado="";

        updateCumulativeViewRemove();
        updateCumulativeView_PeriodRemove();
        updateCumulativeView_DayRemove();

        updateOverlapAreaRemove();

        if(GRAPH.SelectedSite!="" || GRAPH.selectedCrimeType!=""){
              updateOverlap(csData.time.all());
              updateCumulative(csData.labelMonth.all());
              updateCumulative_Day(csData.labelDay.all());
              updateCumulative_Period(csData.labelPeriod.all());

              //MakeTemporalSiteView();
              //MakeTemporalCrimeTypeView();
        }
        //MakeTemporalSiteView(TotalData);
        MakeTemporalCrimeTypeView(TotalData);
        remakeGraph();

    }else{
        GRAPH.IfHotspotSeleccionado=true;
        cleanDivSelection();
        element.setAttribute("class","blockSelected");
        GRAPH.divSeleccionado=element.id;
        id=element.id.split('_')[1];
        GRAPH.HotspotSeleccionado=id;
        //pass data to overlap
        //MakeTemporalSiteView_Hotspot(GRAPH.P_CodesCrimes[id]);
        MakeTemporalCrimeTypeView_Hotspot(GRAPH.P_TypesCrimes[id])

        updateCumulativeViewRemove();
        updateCumulativeView_PeriodRemove();
        updateCumulativeView_DayRemove();

        updateOverlapAreaRemove();
        
        updateOverlap(GRAPH.P_TimeLines[id]);

        updateCumulative(GRAPH.Hotspotlabels[id]);
        updateCumulative_Day(GRAPH.Hotspotlabels_Day[id]);
        updateCumulative_Period(GRAPH.Hotspotlabels_Period[id]);


        GRAPH.MaxCrimes=GRAPH.patterns.max;//-1000;
            SetoresList.features.forEach(function(g,j){
                g.properties.numcrimens=parseFloat(GRAPH.patterns[id][j]);
            });
        svgMap.selectAll("*").remove();
        drawLeafletMap(SetoresList);
        DrawColorPalette();
    }
}

function DrawIndividualHotspots(states){
    GRAPH.Clocks={}; 
    var geojson;

    var width = GRAPH.MinIndividualDiv,
       height = GRAPH.MinHeightDiv;

    var projection  = d3.geoMercator().scale(1);
    var path        = d3.geoPath().projection(projection);
    var scaleCenter = calculateScaleCenter(states);

    projection.scale(scaleCenter.scale)
              .center(scaleCenter.center)
              .translate([width/2, height/2]);
              visualize(states);

    function visualize(states) {
            GRAPH.patternDiv.forEach(function(data, i) {
                //Individual color bars
                var colorBars=d3.select(data.div)
                    .append('div')
                    .attr('id','Div3_'+i)
                    .style('position','absolute');

                //percentagem e individual maps
                var wrapper = d3.select(data.div)
                    .append('div')
                    .style("width", width-10 + 'px')
                    .style("height", height+50 + 'px')
                    .style("aling", 'justify');
                
                var barras = d3.select(data.div)
                    .append('div')
                    .attr('id','Div2_'+i)
                    .style("width", width-10 + 'px')
                    .style("height", height-50 + 'px')
                    .style("display","inline-block")
                    .style("verticalAlign","middle");
                    

                    CreateBars("Div2_"+i,i);
                    createMap(wrapper, states, data,i);
                    createColorPalletes(colorBars,i);

            });
    }

    function createColorPalletes(colorBars,i){
            svgCol = d3.select("#Div3_"+i).append("svg")
                     .attr("height",150);

            var colorScheme = GRAPH.ColorPaletterName;
            var width=100;
            var widthLegend=20;
            var heightPalette=140;
            var colorMapLegend = d3.scaleSequential()
                    .domain([0,width])
                    .interpolator(d3[colorScheme]);

            var y = d3.scaleLinear()
                .range([heightPalette, 0])
                .domain([0, GRAPH.patterns.max]);

            var numTicks;
            if (width >= 100) {
              numTicks = 10;
            } else if (width>=50 && width<100) {
              numTicks = 5;
            } else {
              numTicks = 3;
            };
            var yAxis = d3.axisRight()
              .ticks(numTicks)
              .scale(y);   
            svgCol.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate("+widthLegend/2+"," + 5  + ")")
                .call(yAxis)            

            svgCol.selectAll(".bars")
                .append("g")
                .data(d3.range(heightPalette), function(d) { return d; })
                .enter().append("rect")
                    .attr("class", "bars")
                    .attr("x", -1)
                    .attr("y", function(d, i) { return heightPalette-i+4; })
                    .attr("height", 1)
                    .attr("width", widthLegend/2)
                    .style("fill", function(d, i ) { return colorMapLegend(d); })
    }

    function CreateBars(name,i){//("Div2_"+i,config,i);
        var config = 
          {
            size: 130,
            label: parseInt(GRAPH.TotalLabelInformation[i]["suma"]),
            min:  0,
            max:  100,
            minorTicks: 5,
            greenColor:"#ffffe5",
            yellowColor:"#fe9929",
            redColor:"#662506"
          }
          
          var range = config.max - config.min;
          config.greenZones =[{ from: config.min, to:config.min + range*0.35}];
          config.yellowZones = [{ from: config.min + range*0.35, to: config.min + range*0.7 }];
          config.redZones = [{ from: config.min + range*0.7, to: config.max }];

          
          gauge = new Gauge(name, config);
          gauge.render();
          gauge.redraw(Math.floor(GRAPH.TotalLabelInformation[i]["frequency"]*100),null,Math.floor(GRAPH.TotalLabelInformation[i]["risk"]*100))//parseFloat(GRAPH.patterns["ind_Prob"][i]).toFixed(2));
   }

   function createMap(wrapper, geo, data,i) {      
      var svg = wrapper.append('svg')
          .attr("width", width)
          .attr("height", height);

      svg.selectAll('path')
          .data(geo.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('fill',function(d,j){return GRAPH.IndividualcolorScale(parseFloat(GRAPH.patterns[i][j]))})
          .attr('stroke','#636363')//function(){return MyCrimeColorPalette[0];})
          .attr('opacity',0.7);
  }

  function calculateScaleCenter(features) {
        var bbox_path = path.bounds(features),
          scale = 0.95 / Math.max(
          (bbox_path[1][0] - bbox_path[0][0]) / width,
          (bbox_path[1][1] - bbox_path[0][1]) / height
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


}