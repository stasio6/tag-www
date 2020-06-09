from django.urls import path

from . import views

app_name = 'twitts'
urlpatterns = [
    path('', views.index, name='index'),
    path('<int:twitt_id>/', views.detail, name='details'),
    path('new/', views.new, name='new'),
    path('create/', views.create, name='create'),
    path('author/<slug:author>', views.author, name='author')
]
