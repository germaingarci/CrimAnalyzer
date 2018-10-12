# -*- coding: utf-8 -*-
from django.conf.urls import include,url

from .views import HomePageView,QueryWith_Marker, setor_selected,crime_Data_Extraction,Get_Hotspots,trend_extraction#,function_setor_Selected

urlpatterns=[
	url(r'^$', HomePageView.as_view(), name = 'home'),
	url(r'^QueryWith_Marker/$', QueryWith_Marker, name = 'QueryWith_Marker'),
	url(r'^setor_selected/$', setor_selected, name = 'setor_selected'),
	url(r'^crime_Data_Extraction/$', crime_Data_Extraction, name = 'crime_Data_Extraction'),
	url(r'^Get_Hotspots/$', Get_Hotspots, name = 'Get_Hotspots'),
	url(r'^trend_extraction/$', trend_extraction, name = 'trend_extraction'), 
	#url(r'^function_setor_Selected/$', function_setor_Selected, name = 'function_setor_Selected'),
]