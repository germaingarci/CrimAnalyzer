
  /*
  $('#alertid').fadeIn(1000);
   setTimeout(function() { 
       $('#alertid').fadeOut(1000); 
   }, 5000);*/
/*parameters*/
var Data_GlobalTemporalView;
var Data_CumulativeLabels={"Month":[],"Day":[],"Period":[]};
var Data_CumulativeTemporalView_Day;
var Data_CumulativeTemporalView_Month;
var Data_CumulativeTemporalView_Period;
var DiscretizationFunction;
var TotalData=[];
function main(){
  $('#alertid').hide("fade");
	init();//visualizations inicializations
  /*eliminar*/
  /*GRAPH.codSetorList=codSetorList;
  SetoresList=SetoresList2;
  drawLeafletMap(SetoresList);
  clearMap();*/
  /*eliminar*/
	if(GRAPH.codSetorList.length>0){
		crimeDataExtraction();
    //Additional_crimeDataExtraction();
		//document.getElementById("patterExtraction").disabled = false; //activate Hotspot detection
	}
}

function init(){
	    GRAPH.discretization             = parseInt(document.getElementById("TypeDiscretization").value);
      GRAPH.numberOfHotspots       = parseInt(document.getElementById("numberOfHotspots").value); //number of patterns
      d3.select('#patternDiv').selectAll("*").remove();
      GRAPH.patterns               = {};
      DiscretizationFunction       = GRAPH.discretization==1?d3.timeMonth:d3.timeDay;
      Data_GlobalTemporalView      = new Array();
      TotalData                    = [];
      Data_CumulativeLabels        = {"Month":[],"Day":[],"Period":[]};
      GRAPH.dataset = document.getElementById("dataset").value;
      GRAPH.ListOfCrimeTypesCons = [];
      //Chart Initialization
      ChartsInitialization();
      GRAPH.TopSelectedCrimeTypes = []; 
      GRAPH.TopSelectedYears = [];
}

function ChartsInitialization(){
      GlobalTemporalView_Init();
      CumulativeTemporalView_Init();
      CumulativeTemporalView_Day_Init();
      CumulativeTemporalView_Period_Init();
      clean_RankingTypeView();
      d3.select('#sunBarChart').selectAll("*").remove();
      d3.select('#CrimeTypeList').selectAll("*").remove();
      d3.select('#YearRankingView').selectAll("*").remove();
      cleanDivSelection_CrimeType();
}

//extraction of crime data
function crimeDataExtraction(){
 // if(GRAPH.scaleCenter_Star==undefined){
     // GRAPH.scaleCenter_Star = calculateScaleCenter_SmallMultiples(SetoresList,2*RankingTypeViewSunBarChart.innerRadius,2*RankingTypeViewSunBarChart.innerRadius);
  //}

	spinner.spin(GRAPH.target);
	$.ajax({
		data 		:{'setorcodes':JSON.stringify(GRAPH.codSetorList),'dataset':GRAPH.dataset},
		url 		: '/crime_Data_Extraction/',
		type 	 	: 'get',
       	dataType 	: 'json',
       	success 	: function(json) {
       		spinner.stop();
                  TotalData               = json;
                  TotalData.forEach(function(d){d.date=DiscretizationFunction(GRAPH.dateFmt(d.date));  d.year=d.date.getFullYear();});
             	//Dimensiones	
                	//csData			= crossfilter(json);
                  csData                = crossfilter(TotalData);
             	    csData.dimTime 	 	    = csData.dimension(function (d) { return d["date"];/*GRAPH.dateFmt(d["date"]);*/ });
                  csData.dimCode 	 	    = csData.dimension(function (d) { return d["code"]; });
                  csData.dimCrimeType 	= csData.dimension(function (d) { return d["crimeType"]; });

                  //dimensiones labels
                  csData.dimlabelMonth	= csData.dimension(function (d) { return d["labelMonth"]; });
                  csData.dimlabelDay	  = csData.dimension(function (d) { return d["labelDay"]; });
                  csData.dimlabelPeriod	= csData.dimension(function (d) { return d["labelPeriod"]; });

                  labelDa   = csData.dimlabelDay.group().order(function(d){
                      return  DayLabels.indexOf(d["labelDay"]);
                  });

              	//csData.time 			= GRAPH.discretization==1?csData.dimTime.group(d3.timeMonth):csData.dimTime.group(d3.timeDay);
                  csData.time           = csData.dimTime.group(DiscretizationFunction);
                  csData.Codes 			    = csData.dimCode.group();
                  csData.CrimeTypes 		= csData.dimCrimeType.group();
                  csData.labelMonth 		= csData.dimlabelMonth.group();
                  csData.labelDay 		  = csData.dimlabelDay.group();
                  csData.labelPeriod 		= csData.dimlabelPeriod.group();
             		 
                  csData.CrimeTypes.all().sort(function(a, b) { return a.value - b.value; });
                  GRAPH.CrimeTypeScale.domain(csData.CrimeTypes.all());
                  csData.CrimeTypes.all().forEach(function(d){GRAPH.ListOfCrimeTypesCons.push(d.key);})
                  
             		//sort by date
                 /* csData.Codes.all().sort(function(a,b){return GRAPH.codSetorList.indexOf(a.key) - GRAPH.codSetorList.indexOf(b.key);});
                  csData.labelMonth.all().sort(function(a,b){return MonthLabels.indexOf(a.key)-MonthLabels.indexOf(b.key);});
                  csData.labelDay.all().sort(function(a,b){return DayLabels.indexOf(a.key)-DayLabels.indexOf(b.key);});
                  csData.labelPeriod.all().sort(function(a,b){return PeriodLabels.indexOf(a.key)-PeriodLabels.indexOf(b.key);});*/


             	    csData.time.all().sort(function(a, b) { return a.key - b.key; });	
                  csData.time.all().forEach(function(d){Data_GlobalTemporalView.push({"key":d.key,"value":d.value})})
                  //Data_GlobalTemporalView             = cloneObject(csData.time.all());
                  Data_CumulativeTemporalView_Month   = cloneObject(csData.labelMonth.all());
                  Data_CumulativeTemporalView_Day     = cloneObject(csData.labelDay.all());
                  Data_CumulativeTemporalView_Period  = cloneObject(csData.labelPeriod.all());

                  /*--------------------ADITIONAL CROSSFILTER -----------------------*/
                  GRAPH.dataCrossfilter                     =   crossfilter(TotalData);

                  GRAPH.dataCrossfilter.DimSecondCrimeType  =   GRAPH.dataCrossfilter.dimension(function(d){return d["crimeType"];});
                  GRAPH.dataCrossfilter.SecondCrimeTypes    =   GRAPH.dataCrossfilter.DimSecondCrimeType .group();

                  GRAPH.dataCrossfilter.DimSecondYears      =   GRAPH.dataCrossfilter.dimension(function(f){return f.year;});
                  GRAPH.dataCrossfilter.Years               =   GRAPH.dataCrossfilter.DimSecondYears.group();
                  GRAPH.dataCrossfilter.Years.all().sort(function(a,b){return a.key - b.key;});

                  
                  if(GRAPH.TopSelectedCrimeTypes.length==0 &&GRAPH.TopSelectedYears.length==0 ){
                      csData.CrimeTypes.top(RankingTypeView.num).forEach(function(f){GRAPH.TopSelectedCrimeTypes.push(f.key);});
                      GRAPH.dataCrossfilter.Years.all().forEach(function(f,i){
                            if(i<=RankingTypeView.NumYears){
                              GRAPH.TopSelectedYears.push(f.key);
                            }
                      });
                  }

             	    RenderAll();
             	    document.getElementById("mainButton").disabled=true;
                  HotspotDetection();
       	}
	});
}

function RenderAll(){
      remakeGraph();
	    makeGraphs();
      MakeAdditionalGraphs();
}

function HotspotDetection(){
      d3.select('#patternDiv').selectAll("*").remove();
      //dataFilter, crime type and time period
      
      var AuxTotalData=TotalData;
      var MinDate,MaxDate;

      if(GRAPH.MaxDateSelected!="" && GRAPH.MaxDateSelected!=undefined ){
          MinDate=GRAPH.MinDateSelected;
          MaxDate=GRAPH.MaxDateSelected;
       }else{
            MinDate=d3.min(AuxTotalData,function(d){return d.date;});
            MaxDate=d3.max(AuxTotalData,function(d){return d.date;});
       }

      var range=DiscretizationFunction.count(MinDate,MaxDate);
      var dates=[];
      for(i=0;i<=range;i++){ dates.push(DateToString(DiscretizationFunction.offset(MinDate,i)));     }

      /*var AuxTotalDataA=[];
      //TotalData.forEach(function(f){ f.scalarValue=DiscretizationFunction.count(MinDate,f.date)});
      AuxTotalData.forEach(function(f){ 
                  scalarValue=DiscretizationFunction.count(MinDate,f.date);
                  AuxTotalDataA.push({"code":f.code,"crimeType":f.crimeType,"scalarValue":scalarValue});
      });*/

      //var ListOfCodes         = csData.Codes.all().map(function(g){return g.key});
      var ListOfCrimeTypes    = csData.CrimeTypes.all().map(function(g){return g.key});
      var ListOfLabelsDay     = csData.labelDay.all().map(function(g){return g.key});
      var ListOfLabelsMonth   = csData.labelMonth.all().map(function(g){return g.key});
      var ListOfLabelsPeriod  = csData.labelPeriod.all().map(function(g){return g.key}) ; 

      spinner.spin(GRAPH.target);
      
      if(GRAPH.SiteSelected!="" &&GRAPH.SiteSelected!=undefined){
        ListOfCrimeTypes=[GRAPH.SiteSelected];
      }


      $.ajax({
            data:{'ListOfCodes':JSON.stringify(GRAPH.codSetorList),
                  'ListOfCrimeTypes':JSON.stringify(ListOfCrimeTypes),
                  'dates':JSON.stringify(dates),
                  'k':GRAPH.numberOfHotspots,
                  'dataset':GRAPH.dataset,
                  'MinData':DateToString(MinDate),
                  'MaxData':DateToString(MaxDate),
                  'crimeType': GRAPH.selectedCrimeType,
                  'ListOfMonths':JSON.stringify(MonthLabels),
                  'ListOfDays':JSON.stringify(DayLabels),
                  'ListOfPeriods':JSON.stringify(PeriodLabels)
                  },
            url : '/Get_Hotspots/',
            type: 'get',
            dataType : 'json',
            success : function(json) {
                  GRAPH.TotalLabelInformation   = {};
                  GRAPH.TotalLabelInformation   = json.labels;

                  GRAPH.P_TypesCrimes     = {};
                  GRAPH.P_CodesCrimes     = {};
                  GRAPH.P_TimeLines       = {};

                  GRAPH.Hotspotlabels            = {};
                  GRAPH.Hotspotlabels_Day        = {};
                  GRAPH.Hotspotlabels_Period     = {};

                  GRAPH.patterns={};
                  patterns=json.snmf;

                   
                   var frequencies  = [];
                   var risk         = [];
                   var suma         = [];
                  for(i=0;i<GRAPH.numberOfHotspots;i++){
                        patterns[i]=patterns[i].split(',');
                        frequencies.push(GRAPH.TotalLabelInformation[i]["frequency"]);
                        risk.push(GRAPH.TotalLabelInformation[i]["risk"]);
                        suma.push(GRAPH.TotalLabelInformation[i]["suma"]);
                  }

                  patterns["frequencies"]=frequencies;
                  patterns["total_Prob"]=suma;

                  GRAPH.patterns=patterns;
                  GRAPH.IndividualcolorScale = d3.scaleSequential(d3[GRAPH.ColorPaletterName]).domain([0, parseFloat(GRAPH.patterns.max)]);


                  for (i = 0; i < GRAPH.numberOfHotspots; i++) {
                       GRAPH.P_CodesCrimes[i]=json.DSite[i];
                       GRAPH.P_CodesCrimes[i].forEach(function(g){g.date=GRAPH.dateFmtHotspot(g["date"]); g.value=parseFloat(g.value);});

                       GRAPH.P_TypesCrimes[i]=json.Dcrimetype[i];
                       GRAPH.P_TypesCrimes[i].forEach(function(g){g.date=GRAPH.dateFmtHotspot(g["date"]); g.value=parseFloat(g.value); g.labelMonth=MonthLabels[g.date.getMonth()]}); 

                       var datanest = d3.nest()
                                      .key(function(d) { return d.date })
                                      .rollup(function(leaves){return {"values":leaves,"sum":d3.sum(leaves,function(d){return parseFloat(d.value);})}})
                                      .entries(GRAPH.P_CodesCrimes[i]);

                        GRAPH.P_TimeLines[i]=[];
                        datanest.forEach(function(f){GRAPH.P_TimeLines[i].push({"key":f.key,"value":f.value.sum});});

                        //--------------------------- Label Month--------------------------------------
                        GRAPH.Hotspotlabels[i]=[];
                        MonthLabels.forEach(function(d){ GRAPH.Hotspotlabels[i].push({"key":d,"value":json.labels[i].suma*json.Months[d]}); });

                        GRAPH.Hotspotlabels_Day[i]=[];
                        DayLabels.forEach(function(d){ GRAPH.Hotspotlabels_Day[i].push({"key":d,"value":json.labels[i].suma*json.Days[d]})});

                        GRAPH.Hotspotlabels_Period[i]=[];
                        PeriodLabels.forEach(function(d){ GRAPH.Hotspotlabels_Period[i].push({"key":d,"value":json.labels[i].suma*json.Periods[d]}); });
                        /*//--------------------------- Label Month--------------------------------------
                        var datanest_label = d3.nest()
                                      .key(function(d) { return d.labelMonth })
                                      .rollup(function(leaves){return {"values":leaves,"sum":d3.sum(leaves,function(d){return parseFloat(d.value);})}})
                                      .entries(GRAPH.P_CodesCrimes[i]);

                        GRAPH.Hotspotlabels[i]=[];
                        datanest_label.forEach(function(s){GRAPH.Hotspotlabels[i].push({"key":s.key,"value":s.value.sum});});
                        GRAPH.Hotspotlabels[i].sort(function(a,b){return MonthLabels.indexOf(a.key)-MonthLabels.indexOf(b.key);});
                        
                        //--------------------------- Label Day--------------------------------------
                        var datanest_label_Day = d3.nest()
                                      .key(function(d) { return d.labelDay })
                                      .rollup(function(leaves){return {"values":leaves,"sum":d3.sum(leaves,function(d){return parseFloat(d.value);})}})
                                      .entries(GRAPH.P_CodesCrimes[i]);

                        GRAPH.Hotspotlabels_Day[i]=[];
                        datanest_label_Day.forEach(function(s){GRAPH.Hotspotlabels_Day[i].push({"key":s.key,"value":s.value.sum});});
                        GRAPH.Hotspotlabels_Day[i].sort(function(a,b){return DayLabels.indexOf(a.key)-DayLabels.indexOf(b.key);});

                        //--------------------------- Label Period--------------------------------------
                        var datanest_label_Period = d3.nest()
                                      .key(function(d) { return d.labelPeriod })
                                      .rollup(function(leaves){return {"values":leaves,"sum":d3.sum(leaves,function(d){return parseFloat(d.value);})}})
                                      .entries(GRAPH.P_CodesCrimes[i]);

                        GRAPH.Hotspotlabels_Period[i]=[];
                        datanest_label_Period.forEach(function(s){GRAPH.Hotspotlabels_Period[i].push({"key":s.key,"value":s.value.sum});});
                        GRAPH.Hotspotlabels_Period[i].sort(function(a,b){return PeriodLabels.indexOf(a.key)-PeriodLabels.indexOf(b.key);});*/

                  }
                  spinner.stop();
                  AddDivs();
            }
      });
}

function activateButton(){
  document.getElementById("mainButton").disabled=false;
}

/*---------------------------------------------------------------------------------*/
/*-------------------------- ADDITIONAL ------------------------------------------*/
/*---------------------------------------------------------------------------------*/
function Additional_crimeDataExtraction(){
  //if(GRAPH.scaleCenter==undefined){
      GRAPH.scaleCenter_Star = calculateScaleCenter_SmallMultiples(SetoresList,2*RankingTypeViewSunBarChart.innerRadius,2*RankingTypeViewSunBarChart.innerRadius);
  //}
                  TotalData               = jsonTeste;
                  //TotalData.forEach(function(d){d.date=DiscretizationFunction(GRAPH.dateFmt(d.date));  d.year=d.date.getFullYear();});
                  TotalData.forEach(function(d){d.date=new Date(d.date);  d.year=d.date.getFullYear();});
              //Dimensiones 
                  //csData      = crossfilter(json);
                  csData                = crossfilter(TotalData);
                  csData.dimTime        = csData.dimension(function (d) { return d["date"];/*GRAPH.dateFmt(d["date"]);*/ });
                  csData.dimCode        = csData.dimension(function (d) { return d["code"]; });
                  csData.dimCrimeType   = csData.dimension(function (d) { return d["crimeType"]; });

                  //dimensiones labels
                  csData.dimlabelMonth  = csData.dimension(function (d) { return d["labelMonth"]; });
                  csData.dimlabelDay    = csData.dimension(function (d) { return d["labelDay"]; });
                  csData.dimlabelPeriod = csData.dimension(function (d) { return d["labelPeriod"]; });

                  labelDa   = csData.dimlabelDay.group().order(function(d){
                      return  DayLabels.indexOf(d["labelDay"]);
                  });

                //csData.time       = GRAPH.discretization==1?csData.dimTime.group(d3.timeMonth):csData.dimTime.group(d3.timeDay);
                  csData.time           = csData.dimTime.group(DiscretizationFunction);
                  csData.Codes          = csData.dimCode.group();
                  csData.CrimeTypes     = csData.dimCrimeType.group();
                  csData.labelMonth     = csData.dimlabelMonth.group();
                  csData.labelDay       = csData.dimlabelDay.group();
                  csData.labelPeriod    = csData.dimlabelPeriod.group();
                
                  GRAPH.CrimeTypeScale.domain(csData.CrimeTypes.all());
                //sort by date
                 /* csData.Codes.all().sort(function(a,b){return GRAPH.codSetorList.indexOf(a.key) - GRAPH.codSetorList.indexOf(b.key);});
                  csData.labelMonth.all().sort(function(a,b){return MonthLabels.indexOf(a.key)-MonthLabels.indexOf(b.key);});
                  csData.labelDay.all().sort(function(a,b){return DayLabels.indexOf(a.key)-DayLabels.indexOf(b.key);});
                  csData.labelPeriod.all().sort(function(a,b){return PeriodLabels.indexOf(a.key)-PeriodLabels.indexOf(b.key);});*/


                  csData.time.all().sort(function(a, b) { return a.key - b.key; }); 
                  csData.time.all().forEach(function(d){Data_GlobalTemporalView.push({"key":d.key,"value":d.value})})
                  //Data_GlobalTemporalView             = cloneObject(csData.time.all());
                  Data_CumulativeTemporalView_Month   = cloneObject(csData.labelMonth.all());
                  Data_CumulativeTemporalView_Day     = cloneObject(csData.labelDay.all());
                  Data_CumulativeTemporalView_Period  = cloneObject(csData.labelPeriod.all());

                  /*--------------------ADITIONAL CROSSFILTER -----------------------*/
                  GRAPH.dataCrossfilter                     =   crossfilter(TotalData);

                  GRAPH.dataCrossfilter.DimSecondCrimeType  =   GRAPH.dataCrossfilter.dimension(function(d){return d["crimeType"];});
                  GRAPH.dataCrossfilter.SecondCrimeTypes    =   GRAPH.dataCrossfilter.DimSecondCrimeType .group();

                  GRAPH.dataCrossfilter.DimSecondYears      =   GRAPH.dataCrossfilter.dimension(function(f){return f.year;});
                  GRAPH.dataCrossfilter.Years               =   GRAPH.dataCrossfilter.DimSecondYears.group();
                  GRAPH.dataCrossfilter.Years.all().sort(function(a,b){return a.key - b.key;});

                  GRAPH.TopSelectedCrimeTypes = [];  csData.CrimeTypes.top(RankingTypeView.num).forEach(function(f){GRAPH.TopSelectedCrimeTypes.push(f.key);});
                  GRAPH.dataCrossfilter.Years.all().forEach(function(f,i){
                        if(i<=RankingTypeView.NumYears){
                          GRAPH.TopSelectedYears.push(f.key);
                        }
                  });

                  RenderAll();
                  document.getElementById("mainButton").disabled=true;
}

function DownLoadData(){
    if(GRAPH.codSetorList.length>0){
        objeto={
            "bufferedPolygon":GRAPH.bufferedPolygon,
            "codSetorList":GRAPH.codSetorList,
            "selectedCrimeType":GRAPH.selectedCrimeType,
            "selectedSite":GRAPH.selectedSite,
            "TopSelectedYears":GRAPH.TopSelectedYears,
            "TopSelectedCrimeTypes":GRAPH.TopSelectedCrimeTypes,
            "dataset":GRAPH.dataset,
            "numberOfHotspots":GRAPH.numberOfHotspots,
            "SetoresList":SetoresList,
        };
     downloadObjectAsJson(objeto, "CrimAnalyzer_Data.json");
  }
}

$(document).ready(function() {
    $('#fileInput').change(function(e) {
        files= this.files;
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(files[0]);
    });
});

function onReaderLoad(event){
    spinner.spin(GRAPH.target);
    var obj = JSON.parse(event.target.result);
    init();
    clearMap();
    /*------------------MAP RECUPERATION----------------------*/
    options={clickable: true,dashArray: "1, 10",fill: true,fillColor: null,fillOpacity: 0.2,lineCap: null,lineJoin: null,noClip: false,
              opacity: 0.5,color: '#0033ff',smoothFactor: 1,stroke: true,weight: 5 };
    var polygon = new L.Polygon(obj.bufferedPolygon, options);
    drawnItems.addLayer(polygon);
    map.addLayer(polygon); 
    /*------------------MAP RECUPERATION----------------------*/
    GRAPH.codSetorList = obj.codSetorList;
    GRAPH.selectedCrimeType =  obj.selectedCrimeType;
    GRAPH.selectedSite = obj.selectedSite;
    GRAPH.TopSelectedYears = obj.TopSelectedYears;
    GRAPH.TopSelectedCrimeTypes = obj.TopSelectedCrimeTypes;
    GRAPH.dataset = obj.dataset;
    GRAPH.numberOfHotspots = obj.numberOfHotspots; 
    SetoresList = obj.SetoresList;
    
    /*------------------- draw refered--------------*/
    spinner.stop();
    drawLeafletMap(SetoresList);
    clearMap();
    GRAPH.scaleCenter_Star=undefined;
    document.getElementById("mainButton").disabled=false;

    /*------------------- Crime extraction --------------*/
    if(GRAPH.codSetorList.length>0){
      crimeDataExtraction();
    }
   
}


/*
buffer points
crimesites codes
selectedCrimeType
selectedSite
TypeDiscretization
GRAPH.dataset 


GRAPH.discretization             = parseInt(document.getElementById("TypeDiscretization").value);
      GRAPH.numberOfHotspots       = parseInt(document.getElementById("numberOfHotspots").value); //number of patterns
      d3.select('#patternDiv').selectAll("*").remove();
      GRAPH.patterns               = {};
      DiscretizationFunction       = GRAPH.discretization==1?d3.timeMonth:d3.timeDay;
      Data_GlobalTemporalView      = new Array();
      TotalData                    = [];
      Data_CumulativeLabels        = {"Month":[],"Day":[],"Period":[]};
      GRAPH.dataset = document.getElementById("dataset").value;
      GRAPH.ListOfCrimeTypesCons = [];
      //Chart Initialization
      ChartsInitialization();

*/