# -*- coding: utf-8 -*-
import csv,sys,os
import django
import time
import csv
django.setup()
from .models import Roubo_Crimes,Furto_Crimes,Roubo_VCrimes,Setor
from django.contrib.gis.geos import GEOSGeometry,Point

def run_roubo_crimes_remove():
	crimetypes=['ROUBO CONSUMADO - OUTROS','ROUBO TENTADO - OUTROS','ROUBO  CONSUMADO - OUTROS','ROUBO+LESAO GRAVE-OUTROS']
	for i in crimetypes:
		Roubo_Crimes.objects.filter(nomeCrime=i).delete()

def run_furto_crimes_remove():
	crimetypes=['FURTO QUAL.CONS-OUTROS','FURTO QUAL.TENT- OUTROS','FURTO TENTADO-OUTROS','FURTO COISA COMUM-OUTROS','FURTO - OUTROS']
	for i in crimetypes:
		Furto_Crimes.objects.filter(nomeCrime=i).delete()

def run_roubo_crimes_update():
	crimenomes_Roubo={'ROUBO CONSUMADO - INTERIOR VEIC.':2,'ROUBO - ESTAB.OUTROS':4,'ROUBO CONSUMADO - DOCUMENTO':0,'ROUBO TENTADO - ESTAB.OUTROS':4,'ROUBO TENTADO - ONIBUS':2,'ROUBO+LESAO GRAVE-EST.BANCARIO':4,'ROUBO - INTERIOR ESTEB.':4,'ROUBO CONSUMADO -- CARGA':3,'ROUBO CONSUMADO - MOTO':2,'ROUBO CONSUMADO - TRANSEUNTE':0,'ROUBO  CONSUMADO - INTERIOR VEIC.':2,'ROUBO CONSUMADO - EST.BANCARIO':4,'ROUBO+LESAO GRAVE-ONIBUS':2,'ROUBOCONSUMADO - ONIBUS':2,'ROUBO+LESAO GRAVE-CARGA':3,'ROUBO CONSUMADO - EST.COMERC.':4,'ROUBO TENTADO - MOTO':2,'ROUBO  CONSUMADO -- CARGA':3,'ROUBO+LESAO GRAVE-DOCUMENTO':0,'ROUBO SEGUIDO MORTE-EST.ENSINO':4,'ROUBO+LESAO GRAVE-MOTO':2,'ROUBO TENTADO - EST.ENSINO':4,'ROUBO-INTERIOR TRANSP.COLETIVO':2,'ROUBO CONSUMADO - EST.ENSINO':4,'ROUBO TENTADO-INT.TRANSP.COLET':2,'ROUBO+LESAO GRAVE-RESIDENCIA':1,'ROUBO  CONSUMADO - DOCUMENTO':0,'ROUBO  CONSUMADO - ONIBUS':2,'ROUBO TENTADO - INTERIOR VEIC.':2,'ROUBO TENTADO - TRANSEUNTE':0,'ROUBO+LESAO GRAVE-INTERIOR VEIC.':2,'ROUBO  CONSUMADO - MOTO':2,'ROUBO TENTADO - DOCUMENTO':0,'ROUBO+LESAO GRAVE-TRANSEUNTE':0,'ROUBO CONSUMADO - RESIDENCIA':1,'ROUBO+LESAO GRAVE-EST.ENSINO':4,'ROUBO TENTADO - EST.BANCARIO':4,'ROUBO/FURTO DE DOCUMENTO':0,'ROUBO TENTADO - CARGA':3,'ROUBO CONSUMADO - ONIBUS':2,'ROUBO+LESAO GRAVE-EST.COMERC.':4,'ROUBO TENTADO - RESIDENCIA':1,'ROUBO TENTADO - INTERIOR ESTAB.':4,'ROUBO TENTADO - EST.COMERC.':4}
	crimetypesRoubo = ['ROUBO - TRANSEUNTE','ROUBO - RESIDENCIA','ROUBO - INTERIOR VEIC.','ROUBO - CARGA','ROUBO - EST.COMERC.']

	for key,index in crimenomes_Roubo.items():
		Roubo_Crimes.objects.filter(nomeCrime=key).update(tipoCrime=crimetypesRoubo[index])

def run_furto_crimes_update():
	crimenomes_Furto={'FURTO QUAL.TENT- MOTO':2,'FURTO QUAL.TENT-ESTAB.-OUTROS':4,'FURTO-INTERIOR TRANSP.COLET.':2,'FURTO QUAL.CONS-INTERIOR ESTAB':4,'FURTO QUAL.TENT- ONIBUS':2,'FURTO COISA COMUM-RESIDENCIA':1,'FURTO QUAL.CONS-BIP/PAGER':0,'FURTO - ESTABELECIMENTO COMERCIAL':4,'FURTO COISA COMUM-INTERIOR ESTAB':4,'FURTO COISA COMUM-MOTO':2,'FURTO QUAL.TENT- CARGA':3,'FURTO QUAL.CONS- RESIDENCIA':1,'FURTO QUAL.TENT- EST.ENSINO':4,'FURTO - ONIBUS':2,'FURTO - MOTO':2,'FURTO QUAL.CONS- MOTO':2,'FURTO - BIP/PAGER/CELULAR':0,'FURTO COISA COMUM-INTERIOR VEIC.':2,'FURTO COISA COMUM-DOCUMENTO':0,'FURTO - DOCUMENTOS':0,'FURTO TENTADO-INTERIOR TRANSP.COLETIVO':2,'FURTO QUAL.TENT- INTERIOR VEIC.':2,'FURTO - CARGA':3,'FURTO QUAL.CONS- TRANSEUNTE':0,'FURTO QUAL.TENT- RESIDENCIA':1,'FURTO TENTADO-DOCUMENTO':0,'FURTO QUAL.TENT- TRANSEUNTE':0,'FURTO TENTADO-EST.ENSINO':4,'FURTO TENTADO-MOTO':2,'FURTO - RESIDENCIA':1,'FURTO QUAL.CONS- ONIBUS':2,'FURTO QUAL.CONS-ESTAB.OUTROS':4,'FURTO - ESTABELECIMENTO ENSINO':4,'FURTO TENTADO-ONIBUS':2,'FURTO - TRANSEUNTE':0,'FURTO TENTADO-CARGA':3,'FURTO TENTADO-BIP/PAGER':0,'FURTO COISA COMUM-VEICULO':2,'FURTO QUAL.TENT-BIP/PAGER':0,'FURTO TENTADO-EST.BANCARIO':4,'FURTO QUAL.CONS- DOCUMENTO':0,'FURTO - INTERIOR DE VEICULO':2,'FURTO QUAL.CONS- EST.BANCARIO':4,'FURTO QUAL.CONS- INTERIOR VEIC.':2,'FURTO QUAL.TENT-INTERIOR ESTAB':4,'FURTO COISA COMUM-INTER.TRANSP.COLETIVO':2,'FURTO-ESTAB.OUTROS':4,'FURTO QUAL.CONS- EST.COMERC.':4,'FURTO COISA COMUM-ESTAB.OUTROS':4,'FURTO TENTADO-EST.COMERC.':4,'FURTO COISA COMUM-BIP/PAGER':0,'FURTO TENTADO-TRANSEUNTE':0,'FURTO QUAL.TENT-INTERIOR TRANSP.COLETIVO':2,'FURTO - ESTABELECIMENTO BANCARIO':4,'FURTO TENTADO-ESTAB.OUTROS':4,'FURTO TENTADO-RESIDENCIA':1,'FURTO QUAL.CONS- EST.ENSINO':4,'FURTO COISA COMUM-TRANSEUNTE':0,'FURTO TENTADO-INTERIOR VEIC.':2,'FURTO QUAL.TENT- EST.BANCARIO':4,'FURTO COISA COMUM-EST.ENSINO':4,'FURTO COISA COMUM-ONIBUS':2,'FURTO QUAL.CONS-INTERIOR TRANSP.COLETIVO':2,'FURTO QUAL.TENT- EST.COMERC.':4,'FURTO QUAL.CONS- CARGA':3,'FURTO COISA COMUM-EST.COMERC.':4,'FURTO TENTADO-INTERIOR ESTAB':4,'FURTO QUAL.TENT- DOCUMENTO':0,'FURTO-INTERIOR ESTAB':4}
	crimetypesFurto =['FURTO - TRANSEUNTE','FURTO - RESIDENCIA','ROUBO - INTERIOR VEIC.','ROUBO - CARGA','ROUBO - EST.COMERC.']

	for key,index in crimenomes_Furto.items():
		Furto_Crimes.objects.filter(nomeCrime=key).update(tipoCrime=crimetypesFurto[index])

def run_RouboV_crimes_update():
	rouboV=['ROUBO TENTADO - VEICULO','ROUBO+LESAO GRAVE-VEICULO','ROUBO  CONSUMADO - VEICULO','ROUBO CONSUMADO - VEICULO']
	for item in rouboV:
		Roubo_VCrimes.objects.filter(nomeCrime=item).update(tipoCrime=item)

def arreglando():
	crimetypesRoubo = ['ROUBO - TRANSEUNTE','ROUBO - RESIDENCIA','ROUBO - INTERIOR VEIC.','ROUBO - CARGA','ROUBO - EST.COMERC.']
	de='ROUBO CONSUMADO - ONIBUS'
	Roubo_Crimes.objects.filter(nomeCrime=de).update(tipoCrime=crimetypesRoubo[2])

def Run_Everything():
	print("inicio")
	run_roubo_crimes_remove()
	print("furto remove")
	run_furto_crimes_remove()
	print("roubo update")
	run_roubo_crimes_update()
	print("furto update")
	run_furto_crimes_update()
	print("roubo v update")
	run_RouboV_crimes_update()
	print()

def Add_Graph():
	file = open("F:\\leaftlet\\Graph_Addition\\CODSECTOT.txt", "r")
	CodeList=file.readlines() 

	file2 = open("F:\\leaftlet\\Graph_Addition\\Adjacency.txt", "r")
	adjacency=file2.readlines() 
	dic={}
	for i in range(len(adjacency)):
	    code=CodeList[i].strip().rstrip()
	    array=adjacency[i].split(',')
	    a_result=[]
	    for a in array:
	        entero = int(a.strip().rstrip())-1
	        a_result.append(CodeList[entero].strip().rstrip())
	    str1 = ",".join(str(x) for x in a_result)
	    dic[code]=str1

	for code in CodeList:
		code=code.strip().rstrip()
		Setor.objects.filter(codsetor=code).update(graph=dic[code])



def Put_AdditionalInformationSetor():
	lista=[]
	with open('F:\\CrimAnalyzer\\crimAnalyzer\\adicionales\\reportes.txt', newline='') as csvfile:
		spamreader = csv.reader(csvfile, delimiter=';', quotechar='|')
		for row in spamreader:
			lista.append(row)
	for ind in lista:
		Setor.objects.filter(codsetor=ind[0]).update(nom_mu=ind[1],nom_di=ind[2])

def teste():
	Listasetores        = list(Setor.objects.filter().only('idE','x','y'))
	for se in Listasetores:
		lng=se.y
		lat=se.x
		Setor.objects.filter(idE=se.idE).update(center=Point(lng,lat))