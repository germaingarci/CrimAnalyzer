# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-10-02 22:47
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('analyzer', '0003_auto_20180901_1821'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='furto_crimes',
            table='Furto_Crimes',
        ),
        migrations.AlterModelTable(
            name='roubo_crimes',
            table='Roubo_Crimes',
        ),
        migrations.AlterModelTable(
            name='roubo_vcrimes',
            table='Roubo_VCrimes',
        ),
        migrations.AlterModelTable(
            name='setor',
            table='Setor',
        ),
    ]