# -*- coding: utf-8 -*-
from django.contrib.gis.geos import GEOSGeometry,Point
import datetime
import calendar
from random import randrange

def GetPolygonWithArrays(array1,array2):
    poly='SRID=32140;POLYGON (('+str(array1[0])+' '+str(array2[0])
    for i in range(1,len(array1)):
        poly=poly+','+str(array1[i])+' '+str(array2[i])
    poly=poly+','+str(array1[0])+' '+str(array2[0])+'))'
    return poly

#labels
# name of Month
# name of day
# period of day
def GetLabelofDate(dates):
	labelPeriod=""
	if 0<=dates.hour<6:
		labelPeriod="Dawn"
	elif 6<=dates.hour < 12:
		labelPeriod='Mor'
	elif 12 <= dates.hour < 18:
		labelPeriod='Aft'
	else:
		labelPeriod='Eve'
	return [dates.strftime("%b"),dates.strftime("%a"),labelPeriod]