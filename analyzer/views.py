# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.views.generic import TemplateView
from django.core.serializers import serialize
from django.http import HttpResponse

from django.contrib.gis.db.models import PointField

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
################################
import statsmodels.api as sm
import numpy as np
import math
#import networkx as nx

################################

# Create your views here.
class HomePageView(TemplateView):
	template_name		= 'index.html'

def QueryWith_Marker(request):
    lat					= float(request.GET.get('lat'))
    lng					= float(request.GET.get('lng'))
    pnt                 = Point(lng,lat)
    
    setores				= serialize('geojson',Setor.objects.filter(geom__contains=pnt).only('codsetor','x','y','geom'))
   
    return HttpResponse(json.dumps(setores),content_type='application/json')

def setor_selected(request):#function_setor_Selected(request):
    lats                = json.loads(request.GET.get('lats'))
    longs               = json.loads(request.GET.get('longs'))
    MaxNumberOfNodes    = int(request.GET.get('MaxNumberSites'))

    pos                 = GetPolygonWithArrays(lats,longs)
    poly                = GEOSGeometry(pos)
    Listasetores        = list(Setor.objects.filter().only('idE','x','y'))

    sele                = []
    for ili in Listasetores:
        pnt             = Point(ili.y,ili.x)
        if (poly.contains(pnt)):
            sele.append(float(ili.idE))

    if(len(sele)>MaxNumberOfNodes):
        return HttpResponse(json.dumps({'message':'error','total':len(sele)}),content_type='application/json')
    else:
        return setor_selected_Intermedio(sele)

def setor_selected_Intermedio(sele):
    #setores = serialize('geojson',Setor.objects.filter(idE__in=sele).only('idE','codsetor','x','y','geom','graph','nom_mu','nom_di'))
    setores = serialize('geojson',Setor.objects.filter(idE__in=sele).only('codsetor','geom','nom_mu','nom_di'))
    return HttpResponse(json.dumps(setores),content_type='application/json')
'''
def setor_selected(request):
    lats                = json.loads(request.GET.get('lats'))
    longs               = json.loads(request.GET.get('longs'))
    
    pos                 = GetPolygonWithArrays(lats,longs)
    poly                = GEOSGeometry(pos)
    Listasetores        = list(Setor.objects.filter().only('idE','x','y'))

    sele                = []
    for ili in Listasetores:
        pnt             = Point(ili.y,ili.x)
        if (poly.contains(pnt)):
            sele.append(float(ili.idE))
    setores             = serialize('geojson',Setor.objects.filter(idE__in=sele).only('idE','codsetor','geom','nom_mu','nom_di'))
    return HttpResponse(json.dumps(setores),content_type='application/json')'''


'''
def setor_selected_Optimized(request):
    lats                = json.loads(request.GET.get('lats'))
    longs               = json.loads(request.GET.get('longs'))
    MaxNumberOfNodes    = 50#int(request.GET.get('maxNodes'))

    pos                 = GetPolygonWithArrays(lats,longs)
    poly                = GEOSGeometry(pos)
    Listasetores        = list(Setor.objects.filter().only('codsetor','x','y','graph'))

    filteredCodes=[]
    filterr=[]
    G=nx.Graph()

    for ili in Listasetores:
        pnt = Point(ili.y,ili.x)
        if (poly.contains(pnt)):
            G.add_node(ili.codsetor)
            filteredCodes.append(ili.codsetor)
            filterr.append(ili)

    for ili in filterr:
        coords = ili.graph.split(',')
        for cor in coords:
            if(cor.strip() in filteredCodes):
                G.add_edge(ili.codsetor,cor.strip())
    
    while(len(G.nodes())>MaxNumberOfNodes):
        minimo=min(list(G.degree().values()))
        remove = [node for node,degree in G.degree().items() if degree == minimo]
        for n in remove:
            G.remove_node(n)
            if(len(G.nodes())<=MaxNumberOfNodes):
                break
    setores= serialize('geojson',Setor.objects.filter(codsetor__in=G.nodes()).only('codsetor','x','y','geom','nom_mu','nom_di'))
    return HttpResponse(json.dumps(setores),content_type='application/json')
'''



def crime_Data_Extraction(request):

	setorcodes			= request.GET.get('setorcodes')
	sitesList 			= json.loads(setorcodes)
	formato_fecha 		= "%Y-%m-%d %H:%M:%S"

	dataset				= request.GET.get('dataset')#roubo, roubov, furto

	respuesta 			= DynamicSignalExtraction(sitesList,dataset)

	return HttpResponse(json.dumps(respuesta),content_type='application/json')

def Get_Hotspots(request):
   
    formato_fecha   = "%Y-%m-%d %H:%M:%S"
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

    crimeType       = request.GET.get('crimeType')
    resultado       = Main_NMF(k,ListOfSites,ListOfCrimeTypes,ListOfDates,DataMin,DataMax,dataset,crimeType,ListOfMonths,ListOfDays,ListOfPeriods)

    return HttpResponse(json.dumps(resultado),content_type='application/json')


#--------------------------terceros-----------------    
def slice_it(li, cols=2):
    start = 0
    respuesta=[]
    indexs=[]
    means=[]
    for i in range(cols):
        stop = start + len(li[i::cols])
        respuesta.append(li[start:stop])
        indexs.append(math.floor((start+stop)/2))
        start = stop

    for ss in respuesta:
        means.append(ss.mean())
    return [means,indexs]

def generic_hodrick_Prescott(request):
    y=request.GET.get('timeseries')
    timeseries=json.loads(y)
    temp = sm.tsa.filters.hpfilter(timeseries, 10)
    respuesta=[]
    for d in temp[1]:
        #if(d<0):
        #    d=0
        respuesta.append(str(round(d,4)))
    #return respuesta
    return HttpResponse(json.dumps({"respuesta":respuesta}),content_type='application/json')

#--------------------------terceros-----------------

def trend_extraction(request):
    trend       = request.GET.get('timeseries')
    i           = int(request.GET.get('binsNumber'))
    lamb        = 10
    y           = json.loads(trend)
    temp        = sm.tsa.filters.hpfilter(y, lamb=lamb)
    respuesta   = []
    for d in temp[1]:
        if(d<0):
            d=0
        respuesta.append(str(round(d,4)))
    [means,indexs]=slice_it(temp[1],i)
    return HttpResponse(json.dumps({"respuesta":respuesta,"indexs":indexs,"means":means}),content_type='application/json')