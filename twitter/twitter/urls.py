from django.contrib import admin
from django.urls import include, path
from django.shortcuts import redirect

from . import views

from django.views.generic import RedirectView

urlpatterns = [
    path('', lambda request: redirect('twitts/', permanent=False)),
    path('twitts/', include('twitts.urls')),
    path('admin/', admin.site.urls),
    path('register/', views.register, name='register'),
    path('', include("django.contrib.auth.urls"))
]
