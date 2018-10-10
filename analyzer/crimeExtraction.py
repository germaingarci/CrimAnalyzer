# -*- coding: utf-8 -*-
import numpy as np
from datetime import datetime, date, time, timedelta
import calendar
import math
import csv
import numpy as np
from .models import Roubo_Crimes
from .models import Roubo_VCrimes
from .models import Furto_Crimes
import scipy.cluster.hierarchy as sch
from .utils import GetLabelofDate

def DynamicSignalExtraction(sitesList,dataset):
	formato_fecha = "%Y-%m-%d %H:%M:%S+00:00"

	listOfCrimes=[]
	if(dataset=='roubo'):
		listOfCrimes=list(Roubo_Crimes.objects.filter(codsetor__in  = sitesList))
	elif (dataset=='roubov'):
		listOfCrimes=list(Roubo_VCrimes.objects.filter(codsetor__in = sitesList))
	else:
		listOfCrimes=list(Furto_Crimes.objects.filter(codsetor__in  = sitesList))

	resultado=[]
	for row in listOfCrimes:
		date 	= datetime.strptime(str(row.data),formato_fecha)	#get crime date
		temp 	= str(row.tipoCrime) 									#get crime type
		temp 	= ' '.join(temp.split())							#crime type name cleaning
		[nameMonth,nameDay,periodDay]=GetLabelofDate(date)
		resultado.append({'code':row.codsetor,'date':date.strftime("%d-%m-%Y %H:%M:%S"), 'crimeType':temp,'labelMonth':nameMonth,'labelDay':nameDay,'labelPeriod':periodDay})

	return resultado


