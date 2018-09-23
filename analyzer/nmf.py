# -*- coding: utf-8 -*-
from __future__ import division
import nimfa as nf
import pandas as pd
import numpy as np
from sklearn.manifold import TSNE,MDS
import collections
from .models import Roubo_Crimes
from .models import Roubo_VCrimes
from .models import Furto_Crimes
from .utils import GetLabelofDate
from datetime import datetime, date, time, timedelta
from skimage.filters import threshold_otsu
import calendar
from random import randrange
import bisect

formato_fecha = "%Y-%m-%d %H:%M:%S"
def isInRange(minData,maxData,ActualData):
	return (ActualData>=minData and ActualData<=maxData)

def GetDateIndex(listdates,actualdate):
	return bisect.bisect_left(listdates,actualdate)-1

def GerateDic(codes, N): #stype 0 for day, 1 for Month
    dic={} 
    for i in codes:
        dic[i]=np.zeros(N)
    return [dic,N]  

def bilinear_interpolation(x,y):
    f00 = 0.0
    f10 = 0.5
    f01 = 0.7
    f11 = 1.0
    return(f00*np.multiply((1-x),(1-y))+f10*np.multiply(x,(1-y))
           +f01*np.multiply(y,(1-x))+f11*np.multiply(x,y))

#Main_NMF(k,ListOfCrimes,ListOfSites,ListOfCrimeTypes,ListOfDates,DataMin,DataMax,dataset)
def Main_NMF(NumberOfHotspots,ListOfSites,ListOfCrimeTypes,ListOfDates,DataMin,DataMax,dataset,crimetypes):
	crimetype=' '.join(crimetypes.split())
	formato_fecha  = "%Y-%m-%d %H:%M:%S+00:00"
	formato_fecha2 = "%Y-%m-%d %H:%M:%S"


	date_ListOfDates=[]
	for i in range(len(ListOfDates)):
		date_ListOfDates.append(datetime.strptime(str(ListOfDates[i]),formato_fecha2))

	for i in range(len(ListOfCrimeTypes)):
		temp=ListOfCrimeTypes[i].lower()
		ListOfCrimeTypes[i]=' '.join(temp.split())

	listOfCrimes=[]
	if(dataset=='roubo'):
		listOfCrimes=list(Roubo_Crimes.objects.filter(codsetor__in  = ListOfSites))
	elif (dataset=='roubov'):
		listOfCrimes=list(Roubo_VCrimes.objects.filter(codsetor__in = ListOfSites))
	else:
		listOfCrimes=list(Furto_Crimes.objects.filter(codsetor__in  = ListOfSites))


	NumberOfTimeSlices=len(ListOfDates)
	dic=GerateDic(ListOfSites,NumberOfTimeSlices)[0]

	Dcube=np.zeros((len(ListOfSites),NumberOfTimeSlices,len(ListOfCrimeTypes)))


	#CrimeTypes Aproximation
    test1=np.zeros((len(ListOfCrimeTypes),len(ListOfSites)))
	test2=np.zeros((len(ListOfCrimeTypes),NumberOfTimeSlices))


	for row in listOfCrimes:
		ActualData=datetime.strptime(str(row.data),formato_fecha)
		crimeInterm=' '.join(row.tipoCrime.lower().split())
		if(isInRange(DataMin,DataMax,ActualData)  and (crimeInterm==crimetype.lower() or crimetype=="")):
			#indexTimeSlice=row['scalarValue']
			indexTimeSlice=GetDateIndex(date_ListOfDates,ActualData)

			temp=row.tipoCrime.lower()
			temp=' '.join(temp.split())
			indexCrimeType=ListOfCrimeTypes.index(temp)

			indexSite=ListOfSites.index(row.codsetor)

			test1[indexCrimeType][indexSite]+=1
			test2[indexCrimeType][indexTimeSlice]+=1
			dic[row.codsetor][indexTimeSlice]+=1


	for i in range(len(ListOfCrimeTypes)):
		for j in range(len(ListOfSites)):
			for k in range(NumberOfTimeSlices):
				Dcube[j,k,i]=test1[i,j]+test2[i,k]

	for i in range(len(ListOfSites)):
		soma = np.sum(Dcube[i,:,:],axis=1).reshape(-1,1)
		ids = np.where(soma==0)
		soma[ids] = 1
		soma = np.broadcast_to(soma,(NumberOfTimeSlices,len(ListOfCrimeTypes)))
		Dcube[i,:,:] = np.divide(Dcube[i,:,:],soma)
	
	AuxMatrix={}
	for i in range(len(ListOfSites)):
		AuxMatrix[ListOfSites[i]]=dic[ListOfSites[i]]
	
	crimes=pd.DataFrame.from_dict(AuxMatrix,orient='index')

	[respuesta,respuestaLabels,Dhotspot_Result,Dcrimetype_Result]=NMF_Extraction(NumberOfHotspots,crimes,ListOfSites,ListOfCrimeTypes,Dcube,NumberOfTimeSlices,ListOfDates)
	return {"snmf":respuesta,'labels':respuestaLabels,'DSite':Dhotspot_Result,'Dcrimetype':Dcrimetype_Result}

def NMF_Extraction(k,crimes,codes,ListOfCrimeTypes,Dcube,NumberOfTimeSlices,ListOfDates):
    DM              = pd.DataFrame.as_matrix(crimes.reindex(codes))
    respuesta 		= {}
    snmf            = nf.Snmf(DM.T, seed='random_vcol', max_iter=100, rank=k)
    snmf_fit        = snmf()
    #get basis
    H = snmf_fit.basis().T
    #get coeficients
    W = snmf_fit.coef().T
    
    #####
    # Identifying Hotspots
    #####
    thresh          = threshold_otsu(H)
    H_t             = np.zeros((H.shape[0],H.shape[1]),dtype = int)
    hids            = np.where(H > thresh)
    H_t[hids]       = 1
    
    #sum number of repeat of timeSlices
    at=np.sum(H_t, axis=1)
    indices=[]
    for i in range(len(at)):
        indices.append([at[i],i])
    indices.sort(key=lambda x:x[0],reverse=True)

    # Computing time series of each site for the hotspots
    Dhotspot = np.zeros((k,len(codes),NumberOfTimeSlices))
    for i in range(k):
        Dhotspot[i,:,:] = np.multiply(W[:,i],H[i,:])
    
    Dhotspot_Result=[]
    maxi=0
    for i in range(k):
        intermedio=[]
        c=[]
        for j in range(len(codes)):
            for kt in range(NumberOfTimeSlices): 
                [nameMonth,nameDay,periodDay]=GetLabelofDate(datetime.strptime(str(ListOfDates[kt]),formato_fecha))
                intermedio.append({"date":ListOfDates[kt],"code":codes[j],"value":Dhotspot[i,j,kt],'labelMonth':nameMonth,'labelDay':nameDay,'labelPeriod':periodDay})
            temporal=np.sum(Dhotspot[i,j,:])
            c.append(temporal)
            maxi=max(maxi,temporal)
        Dhotspot_Result.append(intermedio)
        str1 = ",".join(str(x) for x in c)
        respuesta[i]=str1
    respuesta["max"]=maxi#Dhotspot.max()
    
    # computing the timeseries of each crime type for the hotspots
    # computing and get
    Dcrimetype_Result=[]
    Dcrimetype = np.zeros((k,len(ListOfCrimeTypes),NumberOfTimeSlices))
    for i in range(k):
        intermedio=[]
        for j in range(len(ListOfCrimeTypes)):
            Dhotspot_per_crime = np.multiply(Dhotspot[i,:,:],Dcube[:,:,j])
            Dcrimetype[i,j,:] = np.sum(Dhotspot_per_crime,axis=0)
            for kt in range(NumberOfTimeSlices):
                intermedio.append({"date":ListOfDates[kt],"typeCrime":ListOfCrimeTypes[j],"value":Dcrimetype[i,j,kt]})
        Dcrimetype_Result.append(intermedio)
    
    # Computing the number of crimes in each hotspot
    P_crimes = np.zeros((len(codes),k))
    
    for i in range(k):
        M = np.broadcast_to(W[:,i],(W.shape[0],H.shape[1]))
        P_crimes[:,i] = np.dot(M,H[i,:].T).ravel()
    
    total_per_hotspot = np.sum(P_crimes,axis=0)
    total = np.sum(DM) 
    # Computing the frequency
    frequency_per_hotspot = np.sum(H_t,axis=1)/H_t.shape[1]
    
    # computing the risk factor (both parameters must be between [0,1])
    risk_per_hotspot = bilinear_interpolation(frequency_per_hotspot,total_per_hotspot/total)
    ##############################
    respuestaLabels=[]
    for i in range(k):
        respuestaLabels.append({"frequency":frequency_per_hotspot[i], "risk":risk_per_hotspot[i],"suma":total_per_hotspot[i]})
    
    return [respuesta,respuestaLabels,Dhotspot_Result,Dcrimetype_Result] 