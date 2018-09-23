# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-08-31 23:09
from __future__ import unicode_literals

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Furto_Crimes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codsetor', models.CharField(max_length=15)),
                ('data', models.DateTimeField()),
                ('tipoCrime', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Roubo_Crimes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codsetor', models.CharField(max_length=15)),
                ('data', models.DateTimeField()),
                ('tipoCrime', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Roubo_VCrimes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codsetor', models.CharField(max_length=15)),
                ('data', models.DateTimeField()),
                ('tipoCrime', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Setor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('idE', models.FloatField()),
                ('codsetor', models.CharField(max_length=15)),
                ('x', models.FloatField()),
                ('y', models.FloatField()),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
        ),
    ]
