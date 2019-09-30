from django.conf.urls import include, url
from motifdb import views

urlpatterns = [
    url(r'^$', views.index, name='motifdb_index'),
    url(r'^motif_set/(?P<motif_set_id>\w+)/$', views.motif_set,name='motif_set'),
    url(r'^motif/(?P<motif_id>\w+)/$', views.motif,name='motif'),
    url(r'^get_motif/(?P<motif_id>\w+)/$',views.get_motif,name='get_motif'),
    url(r'^update_annotation/(?P<motif_id>\w+)/$', views.update_annotation,name='update_annotation'),
    url(r'^start_motif_matching/(?P<experiment_id>\w+)/$', views.start_motif_matching,name='start_motif_matching'),
    url(r'^list_motifsets/$',views.list_motifsets,name = 'list_motifsets'),
    url(r'^get_motifset/(?P<motifset_id>\w+)/$', views.get_motifset,name='get_motifset'),
    url(r'^get_motifset/$', views.get_motifset_post,name='get_motifset_post'),
    url(r'^get_motifset_metadata/(?P<motifset_id>\w+)/$', views.get_motifset_metadata,name='get_motifset_metadata'),
    url(r'^initialise_api/$', views.initialise_api,name = 'initialise_api'),
    url(r'^create_motifset/$',views.create_motifset,name = 'create_motifset'),
    url(r'^choose_motifs/(?P<motif_set_id>\w+)/(?P<experiment_id>\w+)/$',views.choose_motifs,name = 'choose_motifs'),
    url(r'^edit_motifset_metadata/(?P<motif_set_id>\w+)/$',views.edit_motifset_metadata,name = 'edit_motifset_metadata'),
]