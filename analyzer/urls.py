from django.conf.urls import include,url

from .views import HomePageView,QueryWith_Marker, setor_selected,crime_Data_Extraction,Get_Hotspots

urlpatterns=[
	url(r'^$', HomePageView.as_view(), name = 'home'),
	url(r'^QueryWith_Marker/$', QueryWith_Marker, name = 'QueryWith_Marker'),
	url(r'^setor_selected/$', setor_selected, name = 'setor_selected'),
	url(r'^crime_Data_Extraction/$', crime_Data_Extraction, name = 'crime_Data_Extraction'),
	url(r'^Get_Hotspots/$', Get_Hotspots, name = 'Get_Hotspots'),
]