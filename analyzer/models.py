# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.gis.db import models
from django.contrib.postgres.fields import JSONField
from django.contrib.gis.geos import GEOSGeometry,Point
# Create your models here.


class Setor(models.Model):
    idE 			= models.FloatField() 
    codsetor 		= models.CharField(max_length=15)
    x 				= models.FloatField()
    y 				= models.FloatField()
    graph           = models.CharField(max_length=750)
    nom_mu          = models.CharField(max_length=32)
    nom_di          = models.CharField(max_length=38)
    geom 			= models.MultiPolygonField(srid=4326)

    def __unicode__(self):
        return self.codsetor
    class Meta:
    	db_table	= "crime_setor" #"crime_setor" 

class Roubo_Crimes(models.Model):
    codsetor 		= models.CharField(max_length=15)
    data			= models.DateTimeField()
    nomeCrime       = models.CharField(max_length=100)
    tipoCrime		= models.CharField(max_length=100)

    class Meta:
    	db_table	= "crime_roubo_crimes"#"crime_roubo_crimes" 

class Furto_Crimes(models.Model):
    codsetor 		= models.CharField(max_length=15)
    data			= models.DateTimeField()
    nomeCrime       = models.CharField(max_length=100)
    tipoCrime		= models.CharField(max_length=100)

    class Meta:
    	db_table	= "crime_furto_crimes"#"crime_furto_crimes" 


class Roubo_VCrimes(models.Model):
    codsetor 		= models.CharField(max_length=15)
    data			= models.DateTimeField()
    nomeCrime       = models.CharField(max_length=100)
    tipoCrime		= models.CharField(max_length=100)
    def __unicode__(self):
        return self.codsetor

    class Meta:
    	db_table	= "crime_roubo_vcrimes"#"crime_roubo_vcrimes" 
