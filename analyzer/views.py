from django.shortcuts import render
from django.views.generic import TemplateView
from django.core.serializers import serialize
from django.http import HttpResponse

from django.contrib.gis.geos import GEOSGeometry,Point
from django.contrib.gis.measure import D
from .models import Setor
from django.db.models.functions import Cast
import json
from .utils import GetPolygonWithArrays
from .crimeExtraction import DynamicSignalExtraction
from .nmf2 import Main_NMF
import datetime
import calendar
# Create your views here.
class HomePageView(TemplateView):
	template_name		= 'index.html'

def QueryWith_Marker(request):
    lat					= float(request.GET.get('lat'))
    lng					= float(request.GET.get('lng'))
    pnt 				= Point(lng,lat)
    setores				= serialize('geojson',Setor.objects.filter(geom__contains=pnt))
    return HttpResponse(json.dumps(setores),content_type='application/json')

def setor_selected(request):
    lats 				= json.loads(request.GET.get('lats'))
    longs				= json.loads(request.GET.get('longs'))
    
    pos 				= GetPolygonWithArrays(lats,longs)
    poly 				= GEOSGeometry(pos)
    Listasetores		= list(Setor.objects.filter().only('idE','x','y'))
    sele 				= []
    for ili in Listasetores:
        pnt 			= Point(ili.y,ili.x)
        if (poly.contains(pnt)):
            sele.append(float(ili.idE))
    setores 			= serialize('geojson',Setor.objects.filter(idE__in=sele).only('idE','codsetor','x','y','geom'))
    return HttpResponse(json.dumps(setores),content_type='application/json')

def crime_Data_Extraction(request):

	setorcodes			= request.GET.get('setorcodes')
	sitesList 			= json.loads(setorcodes)
	formato_fecha 		= "%Y-%m-%d %H:%M:%S"

	dataset				= request.GET.get('dataset')#roubo, roubov, furto

	respuesta 			= DynamicSignalExtraction(sitesList,dataset)

	return HttpResponse(json.dumps(respuesta),content_type='application/json')

def Get_Hotspots(request):
   
    formato_fecha = "%Y-%m-%d %H:%M:%S"
    ListOfSites     = json.loads(request.GET.get('ListOfCodes'))
    ListOfCrimeTypes= json.loads(request.GET.get('ListOfCrimeTypes'))
    ListOfDates     = json.loads(request.GET.get('dates'))

    DataMin         = datetime.datetime.strptime(request.GET.get('MinData'),formato_fecha)
    DataMax         = datetime.datetime.strptime(request.GET.get('MaxData'),formato_fecha)
    dataset         = request.GET.get('dataset')
    k               = int(request.GET.get('k'))
    
    ListOfMonths    = json.loads(request.GET.get('ListOfMonths'))
    ListOfDays      = json.loads(request.GET.get('ListOfDays'))
    ListOfPeriods   = json.loads(request.GET.get('ListOfPeriods'))

    crimeType=request.GET.get('crimeType')
    resultado       = Main_NMF(k,ListOfSites,ListOfCrimeTypes,ListOfDates,DataMin,DataMax,dataset,crimeType,ListOfMonths,ListOfDays,ListOfPeriods)

    return HttpResponse(json.dumps(resultado),content_type='application/json')

