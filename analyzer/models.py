from django.db import models
from django.contrib.gis.db import models
from django.contrib.postgres.fields import JSONField
# Create your models here.


class Setor(models.Model):
    idE 			= models.FloatField() 
    codsetor 		= models.CharField(max_length=15)
    x 				= models.FloatField()
    y 				= models.FloatField()
    geom 			= models.MultiPolygonField(srid=4326)

    def __unicode__(self):
        return self.codsetor

    class Meta:
    	db_table	= "crime_setor" 

class Roubo_Crimes(models.Model):
    codsetor 		= models.CharField(max_length=15)
    data			= models.DateTimeField()
    tipoCrime		= models.CharField(max_length=100)

    class Meta:
    	db_table	= "crime_roubo_crimes" 

class Furto_Crimes(models.Model):
    codsetor 		= models.CharField(max_length=15)
    data			= models.DateTimeField()
    tipoCrime		= models.CharField(max_length=100)

    class Meta:
    	db_table	= "crime_furto_crimes" 


class Roubo_VCrimes(models.Model):
    codsetor 		= models.CharField(max_length=15)
    data			= models.DateTimeField()
    tipoCrime		= models.CharField(max_length=100)
    def __unicode__(self):
        return self.codsetor

    class Meta:
    	db_table	= "crime_roubo_vcrimes" 