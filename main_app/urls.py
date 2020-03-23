from django.urls import path, re_path
from django.conf.urls import url
from django.conf.urls.static import static
from django.conf import settings
from . import views

urlpatterns = [
    path('', views.index, name = 'home'),
    # path('templates/<str:old>/', views.templates, name = 'old-templates'),
    # path('templates/<str:new>/', views.templates, name = 'new-templates'),
    re_path(r'^(?P<type>\w+)/(?P<template_name>.+)$', views.template, name='new-template'),
    re_path(r'^(?P<type>\w+)/(?P<template_name>.+)$', views.template, name='old-template'),
]
# + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
